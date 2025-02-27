const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-palette', async (req, res) => {
  try {
    const { userInput } = req.body;
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `As a color theory and branding expert, analyze this business description: "${userInput}"

Consider the following aspects:
1. Industry standards and expectations
2. Target audience psychology
3. Brand personality and values
4. Cultural color associations
5. Accessibility and contrast ratios
6. Current design trends

Generate 3 distinct color palettes, each containing 5 colors that work harmoniously together. For each palette:
- Color 1: Primary brand color
- Color 2: Secondary brand color
- Color 3: Accent color
- Color 4: Text color (ensure WCAG AA compliance)
- Color 5: Call-to-action color

Format your response as valid JSON exactly like this, with no additional text:
{
  "palettes": [
    {
      "mood": "Detailed mood description explaining the psychological impact and use case",
      "colors": [[r,g,b],[r,g,b],[r,g,b],[r,g,b],[r,g,b]]
    },
    {
      "mood": "Detailed mood description explaining the psychological impact and use case",
      "colors": [[r,g,b],[r,g,b],[r,g,b],[r,g,b],[r,g,b]]
    },
    {
      "mood": "Detailed mood description explaining the psychological impact and use case",
      "colors": [[r,g,b],[r,g,b],[r,g,b],[r,g,b],[r,g,b]]
    }
  ]
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
    res.status(500).json({ error: 'Failed to generate color palette' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));