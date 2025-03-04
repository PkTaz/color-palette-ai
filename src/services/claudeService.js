import axios from 'axios';

export const generateColorPalette = async (businessIdea, lockedColors) => {
  try {
    // Convert locked colors to a string format for the prompt
    const lockedColorsStr = lockedColors
      .map((color, index) => 
        color ? `Color ${index + 1}: RGB(${color.join(',')})` : null
      )
      .filter(Boolean)
      .join(', ');

    const response = await fetch('/api/generate-palette', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userInput: businessIdea,
        lockedColors: lockedColors
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating palette:', error);
    throw error;
  }
};