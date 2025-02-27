import axios from 'axios';

export const generateColorPalette = async (userInput) => {
  try {
    const response = await axios.post('http://localhost:5000/api/generate-palette', {
      userInput
    });
    
    // The response should already be parsed JSON
    return response.data;
  } catch (error) {
    console.error('Error generating color palette:', error);
    return null;
  }
};