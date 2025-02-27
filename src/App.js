import React, { useState, useEffect } from 'react';
import { generateColorPalette } from './services/claudeService';
import './App.css';

function App() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [colorPalettes, setColorPalettes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setBusinessIdea(event.target.value);
  };

  const rgbToHex = (rgb) => `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;

  const fetchColorPalette = async () => {
    setIsLoading(true);
    try {
      const response = await generateColorPalette(businessIdea);
      if (response && response.palettes) {
        setColorPalettes(response.palettes);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="App">
      <h1 className='input-title'>Find a Color Palette for Your Business</h1>
      <input 
        value={businessIdea} 
        onChange={handleInputChange} 
        placeholder="Describe your business or brand identity..." 
      />
      <h2>Include Keywords like <p className='kw-template'>"professional" "feminine" "modern" "high-tech"</p></h2>
      <button 
        onClick={fetchColorPalette} 
        disabled={isLoading}
        className="generate-button"
      >
        {isLoading ? (
          <>
            Generating
            <div className="loading-spinner" />
          </>
        ) : (
          'Generate Palettes'
        )}
      </button>
      
      {colorPalettes.map((palette, paletteIndex) => (
        <div key={paletteIndex} className="palette-container">
          <h3 className="palette-mood">{palette.mood}</h3>
          <div className="palette">
            {palette.colors.map((color, index) => (
              <div 
                key={index} 
                className="color-box" 
                style={{ backgroundColor: `rgb(${color.join(',')})` }}
              >
                <span>{rgbToHex(color)}</span>
              </div>
            ))}
          </div>
          
          <div className="example-box" style={{
            background: `linear-gradient(135deg, rgb(${palette.colors[0].join(',')}), rgb(${palette.colors[1].join(',')})`,
            border: `5px solid rgb(${palette.colors[2].join(',')})`,
            color: `rgb(${palette.colors[3].join(',')})`
          }}>
            <h2>Example Header</h2>
            <button 
              className="example-button" 
              style={{ 
                backgroundColor: `rgb(${palette.colors[4].join(',')})`,
                color: `rgb(${palette.colors[3].join(',')})` 
              }}
            >
              Example Button
            </button>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
