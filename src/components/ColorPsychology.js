import React from 'react';
import { industryColors, culturalMeanings, emotionalImpact, brandPersonality } from '../utils/colorPsychology';
import { getColorNameFromRGB } from '../utils/colorUtils';

// Function to get basic color category for cultural meanings
const getColorCategory = (rgb) => {
  // Basic color mapping with RGB ranges for cultural meanings
  const colorRanges = {
    red: ([r, g, b]) => r > 200 && g < 100 && b < 100,
    blue: ([r, g, b]) => b > 200 && r < 100 && g < 100,
    green: ([r, g, b]) => g > 200 && r < 100 && b < 100,
    yellow: ([r, g, b]) => r > 200 && g > 200 && b < 100,
    purple: ([r, g, b]) => r > 150 && b > 150 && g < 100,
    orange: ([r, g, b]) => r > 200 && g > 100 && b < 100,
    black: ([r, g, b]) => r < 50 && g < 50 && b < 50,
    white: ([r, g, b]) => r > 200 && g > 200 && b > 200,
    gray: ([r, g, b]) => Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30
  };

  // Find matching color name
  for (const [name, condition] of Object.entries(colorRanges)) {
    if (condition(rgb)) return name;
  }

  return 'neutral'; // Default fallback
};

// Function to get hex code from RGB
const rgbToHex = (rgb) => {
  const [r, g, b] = rgb;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
};

const ColorPsychology = ({ colors, culture = 'western', businessIdea }) => {
  const detectedIndustry = detectIndustry(businessIdea);

  return (
    <div className="color-psychology-container">
      <h3 style={{ fontSize: '1.6rem', fontWeight: '500', color: 'var(--ou-white)', marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
        Color Psychology Insights
      </h3>
      
      <div className="psychology-section">
        <h4>Industry Alignment for {detectedIndustry.charAt(0).toUpperCase() + detectedIndustry.slice(1)}</h4>
        
        <div className="psychology-content">
          <p className="industry-description">{industryColors[detectedIndustry]?.meanings}</p>
          
          <div className="industry-examples-container">
            <p className="industry-examples">
              <span style={{ color: 'var(--ou-crimson)', fontWeight: '500' }}>Leading brands: </span>
              {industryColors[detectedIndustry]?.examples.join(', ')}
            </p>
          </div>
          
          <div className="recommended-colors">
            <h5 style={{ fontSize: '1rem', marginTop: '1.2rem', marginBottom: '0.8rem', color: 'var(--ou-white)' }}>
              Industry Standard Colors
            </h5>
            <div className="color-recommendations">
              {industryColors[detectedIndustry]?.recommended.map((color, index) => (
                <div key={index} className="recommendation" style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  margin: '0.4rem 0.8rem 0.4rem 0',
                  padding: '0.5rem 0.8rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  <span className="color-dot" style={{ 
                    backgroundColor: color,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    marginRight: '0.6rem',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                  }}></span>
                  <span style={{ fontFamily: 'Roboto Mono, monospace', fontSize: '0.9rem' }}>{color}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="psychology-section">
        <h4>Cultural Color Significance</h4>
        
        <div className="cultural-meanings-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1rem',
          marginTop: '1.2rem'
        }}>
          {colors.map((color, index) => {
            const colorName = getColorNameFromRGB(color);
            const colorCategory = getColorCategory(color);
            const hexCode = rgbToHex(color);
            
            return (
              <div key={index} className="cultural-meaning" style={{ 
                display: 'flex',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}>
                <span className="color-dot" style={{ 
                  backgroundColor: `rgb(${color.join(',')})`,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  marginRight: '1rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                }}></span>
                <div className="meaning-content">
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.4rem'
                  }}>
                    <p className="color-name" style={{ 
                      fontWeight: '500',
                      color: 'var(--ou-white)',
                      textTransform: 'capitalize'
                    }}>{colorName}</p>
                    <span style={{
                      fontSize: '0.75rem',
                      opacity: 0.8,
                      fontFamily: 'monospace'
                    }}>{hexCode}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {culturalMeanings[culture]?.[colorCategory] || `Similar to ${colorName.toLowerCase()} tones in cultural context`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="psychology-section">
        <h4>Emotional Responses</h4>
        
        <div className="emotional-analysis" style={{ marginTop: '1.2rem' }}>
          {colors.map((color, index) => {
            const colorName = getColorNameFromRGB(color);
            const colorCategory = getColorCategory(color);
            const hexCode = rgbToHex(color);
            
            return (
              <div key={index} className="emotion" style={{ 
                position: 'relative', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}>
                <span className="color-dot" style={{ 
                  backgroundColor: `rgb(${color.join(',')})`,
                  filter: 'saturate(1.2)'
                }}></span>
                <div className="emotion-content">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <p className="color-name">{colorName}</p>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'var(--ou-crimson)', 
                      padding: '0.2rem 0.4rem', 
                      borderRadius: '4px',
                      color: 'var(--ou-white)'
                    }}>
                      #{index + 1}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem', opacity: 0.8, fontFamily: 'monospace' }}>
                    {hexCode}
                  </p>
                  <p style={{ fontSize: '0.9rem' }}>
                    {emotionalImpact[colorCategory]?.join(', ') || `${colorName} evokes balance and subtlety`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="psychology-section">
        <h4>Brand Personality Projection</h4>
        
        <div className="brand-personality" style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '1.2rem',
          borderLeft: '3px solid var(--ou-crimson)'
        }}>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
            Your selected palette projects a{' '}
            <span style={{ color: 'var(--ou-crimson)', fontWeight: '500' }}>
              {brandPersonality[detectedIndustry]?.primary || 'balanced'}
            </span>
            {' '}personality with elements of{' '}
            <span style={{ color: 'var(--ou-crimson)', fontWeight: '500' }}>
              {brandPersonality[detectedIndustry]?.secondary || 'professionalism'}
            </span>.
          </p>
          
          <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            {brandPersonality[detectedIndustry]?.description || 
              'This color combination creates a harmonious balance that will resonate well with your target audience.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Detect industry from business idea (simple keyword matching)
const detectIndustry = (businessIdea) => {
  const idea = businessIdea.toLowerCase();
  
  if (idea.includes('tech') || idea.includes('software') || idea.includes('app') || idea.includes('digital')) {
    return 'technology';
  } else if (idea.includes('food') || idea.includes('restaurant') || idea.includes('cafe') || idea.includes('bakery')) {
    return 'food';
  } else if (idea.includes('health') || idea.includes('medical') || idea.includes('clinic') || idea.includes('therapy')) {
    return 'healthcare';
  }
  
  return 'general';
};

export default ColorPsychology;