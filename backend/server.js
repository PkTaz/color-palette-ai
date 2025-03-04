const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Simplified color keyword mapping
const colorKeywords = {
  white: [255, 255, 255],
  black: [0, 0, 0],
  red: [255, 0, 0],
  blue: [0, 0, 255],
  green: [0, 255, 0]
};

// Color theory helper functions
const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

app.post('/api/generate-palette', async (req, res) => {
  try {
    const { userInput, lockedColors } = req.body;
    
    const lockedColorsStr = lockedColors
      .map((color, index) => 
        color ? `Position ${index + 1}: RGB(${color.join(',')})` : null
      )
      .filter(Boolean)
      .join(', ');

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `As a color theory expert, analyze this business description and create a harmonious color palette.

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

Return exactly this JSON structure:
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
}`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const parsedPalettes = JSON.parse(jsonMatch[0]);
    res.json(parsedPalettes);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate color palette',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));