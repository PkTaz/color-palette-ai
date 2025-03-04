import React, { useState, useEffect, useRef } from 'react';
import { generateColorPalette } from './services/claudeService';
import './App.css';
import { FaHammer } from 'react-icons/fa';

// Add new imports
import { ColorAI } from './utils/colorAI';
import { ColorLearningSystem } from './utils/colorLearning';
import { processImage } from './services/imageService';
import ColorPsychology from './components/ColorPsychology';
import ColorTheory from './components/ColorTheory';

// Initialize AI systems
const colorAI = new ColorAI();
const learningSystem = new ColorLearningSystem();

function App() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [colorPalette, setColorPalette] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState(() => {
    const saved = localStorage.getItem('savedPalettes');
    return saved ? JSON.parse(saved) : [];
  });

  // Update the state declarations at the top of App component
  const [lockedColors, setLockedColors] = useState(new Set());
  const [currentPalette, setCurrentPalette] = useState(Array(5).fill([255, 255, 255]));
  const [notification, setNotification] = useState(null);
  const [industry, setIndustry] = useState('technology');
  const [culture, setCulture] = useState('western');
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef(null);

  // Update the copyToClipboard function
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Create a more elegant notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 16px; color: var(--ou-white);">✓</span>
            <div>
              <div style="font-weight: 500; margin-bottom: 2px;">${type} copied to clipboard</div>
              <div style="font-size: 12px; opacity: 0.8;">${text}</div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after animation completes
        setTimeout(() => {
          notification.remove();
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  useEffect(() => {
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  // Add scroll event listener with precise tracking
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) over first 200px of scroll
      const scrollY = window.scrollY;
      const maxScroll = 200;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      setScrollProgress(progress);
      
      // Apply the scroll progress as a CSS variable
      if (headerRef.current) {
        headerRef.current.style.setProperty('--scroll-progress', progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInputChange = (event) => {
    setBusinessIdea(event.target.value);
  };

  const rgbToHex = (rgb) => `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;

  // Update the fetchColorPalette function
  const fetchColorPalette = async () => {
    setIsLoading(true);
    try {
      // Create array showing which colors are locked and their RGB values
      const lockedColorsData = currentPalette.map((color, index) => 
        lockedColors.has(index) ? color : null
      );

      const response = await generateColorPalette(businessIdea, lockedColorsData);
      if (response?.palettes?.[0]) {
        // Merge new colors with locked colors
        const newColors = response.palettes[0].colors.map((color, index) => 
          lockedColors.has(index) ? currentPalette[index] : color
        );
        
        setCurrentPalette(newColors);
        setColorPalette({
          ...response.palettes[0],
          colors: newColors
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  // Add image upload handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const imageData = await processImage(file);
        const colors = await colorAI.extractColorsFromImage(imageData);
        setColorPalette({
          ...colorPalette,
          colors,
          source: 'image'
        });
      } catch (error) {
        console.error('Error processing image:', error);
      }
      setIsLoading(false);
    }
  };

  // Add the missing savePalette function
  const savePalette = () => {
    if (!colorPalette) return;
    
    // Create palette object with current data
    const newPalette = {
      ...colorPalette,
      id: Date.now(),
      businessDescription: businessIdea
    };
    
    // Add to saved palettes array
    setSavedPalettes(prevPalettes => [newPalette, ...prevPalettes]);
  };

  const handleLike = () => {
    if (!colorPalette) return;
    
    // Record positive feedback
    learningSystem.recordFeedback({
      paletteId: colorPalette.id || Date.now(),
      feedback: 'positive',
      businessIdea,
      timestamp: new Date()
    });
    
    savePalette();
    
    // Enhanced notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 16px; color: var(--ou-white);">👍</span>
        <div>
          <div style="font-weight: 500; margin-bottom: 2px;">Palette saved</div>
          <div style="font-size: 12px; opacity: 0.8;">Added to your collection</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleDislike = () => {
    if (!colorPalette) return;
    
    // Record negative feedback
    learningSystem.recordFeedback({
      paletteId: colorPalette.id || Date.now(),
      feedback: 'negative',
      businessIdea,
      timestamp: new Date()
    });
    
    // Enhanced notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 16px; color: var(--ou-white);">👎</span>
        <div>
          <div style="font-weight: 500; margin-bottom: 2px;">Feedback recorded</div>
          <div style="font-size: 12px; opacity: 0.8;">Generating a new palette next time</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleRemoveSaved = (paletteId) => {
    setSavedPalettes(savedPalettes.filter(palette => palette.id !== paletteId));
  };

  // Add a more descriptive handleColorLock function
  const handleColorLock = (index) => {
    if (!colorPalette) return;
    
    setLockedColors(prev => {
      const newLocked = new Set(prev);
      if (newLocked.has(index)) {
        newLocked.delete(index);
      } else {
        newLocked.add(index);
      }
      return newLocked;
    });

    // Store the current color when locking
    setCurrentPalette(prev => {
      const newPalette = [...prev];
      newPalette[index] = colorPalette.colors[index];
      return newPalette;
    });
  };

  // Add this new handler function after handleRemoveSaved
  const handleRestorePalette = (palette) => {
    setColorPalette(palette);
    setCurrentPalette(palette.colors);
    setBusinessIdea(palette.businessDescription);
    // Reset locked colors when restoring a palette
    setLockedColors(new Set());
  };

  return (
    <div className="app-container">
      <header ref={headerRef} className="app-header" style={{ '--scroll-progress': scrollProgress }}>
        <div className="header-content">
          <div className="logo-container">
            <div className="header-logo">
              <FaHammer className="logo-icon" />
              <span>ColorPal</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="main-wrapper">
        <main className="main-content">
          <section className="input-section">
            <h1 className="input-title">Generate Brand Colors</h1>
            <p className="input-description">
              Describe your business or project, and our AI will create a harmonious color palette tailored to your industry and brand values.
            </p>
            
            <div className="input-container">
              <input
                type="text"
                value={businessIdea}
                onChange={handleInputChange}
                placeholder="e.g. A modern coffee shop with organic products and a cozy atmosphere"
                onKeyPress={(e) => e.key === 'Enter' && fetchColorPalette()}
              />
            </div>
            
            <button 
              className="generate-button"
              onClick={fetchColorPalette}
              disabled={isLoading || !businessIdea.trim()}
            >
              {isLoading ? 'Generating...' : 'Generate Palette'}
              {isLoading && <div className="loading-spinner"></div>}
            </button>
          </section>
          
          {colorPalette && (
            <div className="palette-container">
              {colorPalette.mood && (
                <div className="palette-mood">{colorPalette.mood}</div>
              )}
              
              <div className="palette">
                {colorPalette.colors.map((color, index) => {
                  const [r, g, b] = color;
                  const backgroundColor = `rgb(${r}, ${g}, ${b})`;
                  const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000' : '#fff';
                  const isLocked = lockedColors.has(index);
                  const hexColor = '#' + r.toString(16).padStart(2, '0') + 
                                        g.toString(16).padStart(2, '0') + 
                                        b.toString(16).padStart(2, '0');
                  
                  return (
                    <div 
                      className="color-box-container" 
                      key={index} 
                      style={{ '--i': index }}
                    >
                      <div 
                        className={`color-box ${isLocked ? 'locked' : ''}`}
                        style={{ backgroundColor, color: textColor }}
                        onClick={() => handleColorLock(index)}
                      >
                        {isLocked && (
                          <div className="lock-indicator">🔒</div>
                        )}
                        
                        <div className="copy-buttons">
                          <button 
                            className="copy-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`rgb(${r}, ${g}, ${b})`, 'RGB');
                            }}
                          >
                            RGB
                          </button>
                          <button 
                            className="copy-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(hexColor, 'HEX');
                            }}
                          >
                            HEX
                          </button>
                        </div>
                        
                        <div className="color-hex">{hexColor}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {colorPalette.marketAnalysis && (
                <div className="market-analysis">
                  <h4>Similar Successful Brands</h4>
                  {colorPalette.marketAnalysis.similarBrands.map((brand, index) => (
                    <div key={index} className="brand-example">
                      <h5>{brand.name}</h5>
                      <p className="brand-industry">{brand.industry}</p>
                      <p className="brand-colors">{brand.colorUse}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {colorPalette.accessibilityScores && (
                <div className="accessibility-info">
                  <h4>Accessibility Metrics</h4>
                  <p>Text Contrast: {colorPalette.accessibilityScores?.textContrast || 'N/A'}</p>
                  <p>WCAG Compliance: {colorPalette.accessibilityScores?.wcagCompliance || 'N/A'}</p>
                  <p>Colorblind Safe: {
                    colorPalette.accessibilityScores?.colorBlindnessSafe ? '✓' : '×'
                  }</p>
                </div>
              )}
              
              <div className="example-box" style={{
                background: `linear-gradient(135deg, rgb(${colorPalette.colors[0].join(',')}), rgb(${colorPalette.colors[1].join(',')})`,
                border: `5px solid rgb(${colorPalette.colors[2].join(',')})`,
                color: `rgb(${colorPalette.colors[3].join(',')})`
              }}>
                <h2>Example Header</h2>
                <button 
                  className="example-button" 
                  style={{ 
                    backgroundColor: `rgb(${colorPalette.colors[4].join(',')})`,
                    color: `rgb(${colorPalette.colors[3].join(',')})` 
                  }}
                >
                  Example Button
                </button>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              
              <ColorPsychology 
                colors={colorPalette.colors}
                businessIdea={businessIdea}
                culture={colorPalette.culture || 'western'}
              />
              
              <div className="feedback-buttons">
                <button className="like-button" onClick={handleLike}>
                  <span className="button-icon">👍</span>
                  Save Palette
                </button>
                <button className="dislike-button" onClick={handleDislike}>
                  <span className="button-icon">👎</span>
                  Generate New
                </button>
              </div>
            </div>
          )}

          {/* Add Color Theory Section */}
          <ColorTheory />
        </main>
        
        <aside className="saved-palettes">
          <h2>Saved Palettes</h2>
          {savedPalettes.length === 0 ? (
            <p style={{ color: 'var(--gray-300)', textAlign: 'center', margin: '20px 0' }}>
              No saved palettes yet. Like a palette to save it.
            </p>
          ) : (
            savedPalettes.map(palette => (
              <div className="saved-palette" key={palette.id}>
                <div className="saved-palette-content" onClick={() => handleRestorePalette(palette)}>
                  <p className="saved-description">{palette.businessDescription}</p>
                  <div className="mini-palette">
                    {palette.colors.map((color, index) => {
                      const [r, g, b] = color;
                      return (
                        <div 
                          key={index}
                          className="mini-color-box" 
                          style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
                <button 
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSaved(palette.id);
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </aside>
      </div>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;
