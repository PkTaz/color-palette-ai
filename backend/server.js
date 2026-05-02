const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const getEnvPath = path.join(__dirname, 'get.env');
const dotEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(getEnvPath)) {
  require('dotenv').config({ path: getEnvPath });
}
if (fs.existsSync(dotEnvPath)) {
  require('dotenv').config({ path: dotEnvPath });
}

const app = express();
app.use(cors());
app.use(express.json());

/** Prefer Gemini 2.5 Flash; fall back if quota/model unavailable (override with GEMINI_MODEL). */
const GEMINI_MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
];

function shouldTryNextGeminiModel(message) {
  const m = message || '';
  return (
    m.includes('429') ||
    m.includes('Quota exceeded') ||
    m.includes('RESOURCE_EXHAUSTED') ||
    m.includes('quota') ||
    (m.includes('404') && m.toLowerCase().includes('not found')) ||
    m.includes('limit: 0')
  );
}

function buildPalettePrompt(userInput, lockedColorsStr) {
  return `As a color theory expert, analyze this business description and create a harmonious color palette.

Business Description: "${userInput}"

First, determine the primary industry category:
- Food/Restaurant (includes restaurants, cafes, bars, food service)
- Healthcare (medical facilities, wellness centers)
- Technology (software, IT, digital services)
- Fashion/Retail (clothing, accessories, shopping)
- Finance (banking, investments, insurance)
- Education (schools, training, learning)
- Entertainment (media, games, arts)
- General Business (if none above clearly match)

Then, create a color palette that:
1. Follows industry-specific best practices
2. Respects these locked colors if specified: ${lockedColorsStr || 'No locked colors'}
3. Creates perfect harmony using color theory principles:
   - Complementary colors
   - Analogous colors
   - Split-complementary
   - Triadic relationships
4. Ensures high contrast and accessibility
5. Assigns specific roles to the 5 colors:
   - Color 1: Primary brand color
   - Color 2: Secondary/supporting color
   - Color 3: Accent/highlight color
   - Color 4: Text color
   - Color 5: Interactive elements

Return exactly this JSON shape (use integers 0-255 for each RGB):
{
  "palettes": [{
    "mood": "Technical description of color harmony",
    "industry": "Detected industry category",
    "colors": [[r,g,b], [r,g,b], [r,g,b], [r,g,b], [r,g,b]],
    "colorTheory": {
      "industryAnalysis": "Why these colors work for this specific industry",
      "harmony": "Type of color relationship used",
      "explanation": "How the colors work together and with any locked colors"
    }
  }]
}

Output rules: Reply with ONLY that single JSON object. No markdown, no code fences, no text before or after the JSON.`;
}

/** Strip optional ```json fences, then pull the first brace-balanced JSON object. */
function extractFirstJsonObject(raw) {
  let s = String(raw).trim().replace(/^\uFEFF/, '');
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();

  const start = s.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }
  return null;
}

function getResponseText(result) {
  const response = result.response;
  try {
    if (typeof response.text === 'function') {
      const t = response.text();
      if (t) return t;
    }
  } catch (e) {
    if (e.message) throw e;
  }
  const parts = response?.candidates?.[0]?.content?.parts;
  if (parts?.[0]?.text) return parts[0].text;

  const block = response?.promptFeedback?.blockReason;
  if (block) {
    throw new Error(`Request blocked by model safety settings (${block})`);
  }
  throw new Error('Model returned no text. Try another GEMINI_MODEL in get.env (e.g. gemini-1.5-flash).');
}

function parsePaletteJson(text) {
  if (!text || !String(text).trim()) {
    throw new Error('Empty model response');
  }

  const trimmed = String(text).trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    /* continue */
  }

  const blob = extractFirstJsonObject(trimmed);
  if (!blob) {
    console.error(
      '[palette] No JSON object found. Preview:',
      trimmed.slice(0, 600).replace(/\n/g, ' ')
    );
    throw new Error('No valid JSON found in model response');
  }

  try {
    return JSON.parse(blob);
  } catch (e) {
    console.error('[palette] JSON.parse failed on extracted object. Preview:', blob.slice(0, 600));
    throw new Error(`Model returned malformed JSON: ${e.message}`);
  }
}

async function generatePaletteFromGemini(apiKey, prompt, modelName) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const tryGenerate = async (useJsonMime) => {
    const generationConfig = {
      maxOutputTokens: 4096,
      temperature: 0.5,
    };
    if (useJsonMime) {
      generationConfig.responseMimeType = 'application/json';
    }
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig,
    });
    return model.generateContent(prompt);
  };

  try {
    const result = await tryGenerate(true);
    return getResponseText(result);
  } catch (firstErr) {
    console.warn(
      `[${modelName}] JSON mode failed, retrying without responseMimeType:`,
      firstErr.message
    );
    const result = await tryGenerate(false);
    return getResponseText(result);
  }
}

async function generatePaletteWithModelFallback(apiKey, prompt) {
  const explicit = process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim();
  const modelOrder = explicit
    ? [explicit]
    : GEMINI_MODEL_FALLBACKS;

  let lastError;
  for (let i = 0; i < modelOrder.length; i++) {
    const modelName = modelOrder[i];
    try {
      const text = await generatePaletteFromGemini(apiKey, prompt, modelName);
      if (!explicit && i > 0) {
        console.log(`Gemini: succeeded with fallback model "${modelName}"`);
      }
      return text;
    } catch (e) {
      lastError = e;
      const msg = e?.message || String(e);
      const hasNext = i < modelOrder.length - 1;
      if (explicit || !hasNext || !shouldTryNextGeminiModel(msg)) {
        throw e;
      }
      console.warn(`Gemini model "${modelName}" failed; trying next. ${msg.slice(0, 160)}`);
    }
  }
  throw lastError;
}

app.post('/api/generate-palette', async (req, res) => {
  try {
    const { userInput, lockedColors } = req.body;

    const apiKey =
      process.env.GEMINI_SECRET_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey || !String(apiKey).trim()) {
      return res.status(500).json({
        error: 'Missing Gemini API key',
        details:
          'Save GEMINI_SECRET_KEY (or GEMINI_API_KEY) in backend/get.env — the file must be saved to disk. Copy backend/get.env.example to get.env.',
      });
    }

    const lockedColorsStr = (lockedColors || [])
      .map((color, index) =>
        color ? `Position ${index + 1}: RGB(${color.join(',')})` : null
      )
      .filter(Boolean)
      .join(', ');

    const prompt = buildPalettePrompt(userInput, lockedColorsStr);
    const text = await generatePaletteWithModelFallback(apiKey.trim(), prompt);
    const parsedPalettes = parsePaletteJson(text);

    if (!parsedPalettes?.palettes?.[0]?.colors) {
      throw new Error('Model response missing palettes[0].colors');
    }

    res.json(parsedPalettes);
  } catch (error) {
    console.error('Palette generation failed:', error);
    const message = error?.message || String(error);
    res.status(500).json({
      error: 'Failed to generate color palette',
      details: message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
