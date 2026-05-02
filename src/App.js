import React, { useState, useEffect, useRef } from 'react';
import { generateColorPalette } from './services/paletteService';
import './App.css';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { ColorLearningSystem } from './utils/colorLearning';
import ColorPsychology from './components/ColorPsychology';
import ColorTheory from './components/ColorTheory';

const learningSystem = new ColorLearningSystem();

function App() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [colorPalette, setColorPalette] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState(() => {
    const saved = localStorage.getItem('savedPalettes');
    return saved ? JSON.parse(saved) : [];
  });


  const [lockedColors, setLockedColors] = useState(new Set());
  const [currentPalette, setCurrentPalette] = useState(Array(5).fill([255, 255, 255]));
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef(null);


  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
     
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 16px; color: var(--text-primary);">✓</span>
            <div>
              <div style="font-weight: 500; margin-bottom: 2px;">${type} copied to clipboard</div>
              <div style="font-size: 12px; opacity: 0.8;">${text}</div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        
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

  // Update the fetchColorPalette function
  const fetchColorPalette = async () => {
    setIsLoading(true);
    try {
      
      const lockedColorsData = currentPalette.map((color, index) => 
        lockedColors.has(index) ? color : null
      );

      const response = await generateColorPalette(businessIdea, lockedColorsData);
      if (response?.palettes?.[0]) {
        // Merged new colors with locked colors
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

  
  const savePalette = () => {
    if (!colorPalette) return;
    
    
    const newPalette = {
      ...colorPalette,
      id: Date.now(),
      businessDescription: businessIdea
    };
    
    
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
        <span style="font-size: 16px; color: var(--text-primary);">✓</span>
        <div>
          <div style="font-weight: 600; margin-bottom: 2px;">Archived to library</div>
          <div style="font-size: 12px; opacity: 0.8;">Ready whenever you need to restore it</div>
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
    
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 16px; color: var(--text-primary);">✓</span>
        <div>
          <div style="font-weight: 600; margin-bottom: 2px;">Preference logged</div>
          <div style="font-size: 12px; opacity: 0.8;">We will bias away from this pattern next run</div>
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
              <span className="brand-mark" aria-hidden>
                <HiOutlineSparkles className="logo-icon" />
              </span>
              <span className="brand-name">
                ColorPal{' '}
                <span className="brand-ai">AI</span>
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="main-wrapper">
        <main className="main-content">
          <section className="input-section">
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden />
              Brand &amp; product design teams
            </p>
            <h1 className="input-title">Turn your positioning into a cohesive palette</h1>
            <p className="input-description">
              Describe your company or product. <strong>ColorPal AI</strong> turns that brief into five role-aware colors with rationale you can share or hand off to design.
            </p>
            
            <div className="input-container">
              <input
                type="text"
                value={businessIdea}
                onChange={handleInputChange}
                placeholder="e.g. A climate fintech for SMBs—precise, optimistic, deeply trustworthy"
                onKeyPress={(e) => e.key === 'Enter' && fetchColorPalette()}
              />
            </div>
            
            <button 
              className="generate-button"
              onClick={fetchColorPalette}
              disabled={isLoading || !businessIdea.trim()}
            >
              {isLoading ? 'Synthesizing palette…' : 'Generate palette'}
              {isLoading && <div className="loading-spinner"></div>}
            </button>
          </section>
          
          {colorPalette && (
            <div className="palette-container">
              <p className="results-eyebrow">Your system</p>
              <h2 className="results-title">Curated five-color stack</h2>
              <p className="results-hint">Tap a swatch to lock it; locked colors persist when you regenerate.</p>
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
                  <h4>Market parallels</h4>
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
                  <h4>Accessibility signals</h4>
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
                <p className="preview-eyebrow">Live canvas</p>
                <h2>Experience your palette in context</h2>
                <button 
                  className="example-button" 
                  style={{ 
                    backgroundColor: `rgb(${colorPalette.colors[4].join(',')})`,
                    color: `rgb(${colorPalette.colors[3].join(',')})` 
                  }}
                >
                  Primary action
                </button>
                <p>Preview how gradients, borders, and type read together before you commit to production.</p>
              </div>
              
              <ColorPsychology 
                colors={colorPalette.colors}
                businessIdea={businessIdea}
                culture={colorPalette.culture || 'western'}
              />
              
              <div className="feedback-buttons">
                <button type="button" className="like-button" onClick={handleLike}>
                  <span className="button-icon" aria-hidden>✓</span>
                  Save to library
                </button>
                <button type="button" className="dislike-button" onClick={handleDislike}>
                  <span className="button-icon" aria-hidden>↻</span>
                  Refine next run
                </button>
              </div>
            </div>
          )}

          {/* Color Theory Section */}
          <ColorTheory />
        </main>
        
        <aside className="saved-palettes">
          <h2>Library</h2>
          <p className="saved-palettes-sub">Versioned palettes from your session.</p>
          {savedPalettes.length === 0 ? (
            <p className="saved-palettes-empty">
              Nothing archived yet—save a winning palette and it lands here instantly.
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
                  Archive out
                </button>
              </div>
            ))
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;
