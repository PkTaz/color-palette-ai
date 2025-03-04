import React, { useState } from 'react';
import { 
  FaPalette, 
  FaEyeDropper, 
  FaBrain, 
  FaCircle, 
  FaUniversalAccess, 
  FaPrint, 
  FaLightbulb,
  FaRegCompass
} from 'react-icons/fa';
import { 
  MdColorLens, 
  MdInvertColors, 
  MdOutlineGridOn, 
  MdLoop
} from 'react-icons/md';
import { 
  IoIosColorPalette, 
  IoIosColorFilter, 
  IoIosColorWand 
} from 'react-icons/io';
import { 
  BiCircle, 
  BiCircleHalf, 
  BiCircleThreeQuarter, 
  BiCircleQuarter 
} from 'react-icons/bi';
import { TbColorSwatch } from 'react-icons/tb';

const ColorTheory = () => {
  const [activeHarmony, setActiveHarmony] = useState('complementary');
  
  const harmonyOptions = [
    { id: 'complementary', label: 'Complementary', icon: <BiCircleHalf className="harmony-icon" /> },
    { id: 'analogous', label: 'Analogous', icon: <BiCircleQuarter className="harmony-icon" /> },
    { id: 'triadic', label: 'Triadic', icon: <BiCircle className="harmony-icon" /> },
    { id: 'split', label: 'Split Complementary', icon: <BiCircleThreeQuarter className="harmony-icon" /> },
    { id: 'tetradic', label: 'Tetradic', icon: <MdOutlineGridOn className="harmony-icon" /> },
    { id: 'monochromatic', label: 'Monochromatic', icon: <MdInvertColors className="harmony-icon" /> }
  ];
  
  // Dynamic examples based on color theory principles
  const examples = {
    complementary: ['#FF0000', '#00FFFF'],
    analogous: ['#FF0000', '#FF8000', '#FFFF00'],
    triadic: ['#FF0000', '#00FF00', '#0000FF'],
    split: ['#FF0000', '#00FF80', '#0080FF'],
    tetradic: ['#FF0000', '#FFFF00', '#00FFFF', '#0000FF'],
    monochromatic: ['#FF0000', '#CC0000', '#990000', '#660000', '#330000']
  };
  
  const colorTheoryCards = [
    {
      title: 'Color Psychology',
      icon: <FaBrain className="card-icon" />,
      content: 'Colors evoke emotional and psychological responses. For example, blue promotes trust and calm, while red creates urgency and excitement.',
      example: ['#0062B8', '#D73A49', '#28A745', '#FFCA28']
    },
    {
      title: 'Color Harmonies',
      icon: <IoIosColorPalette className="card-icon" />,
      content: 'Color harmonies are structured relationships between colors that create pleasing visual experiences and balanced designs.',
      example: examples[activeHarmony]
    },
    {
      title: 'RGB vs CMYK',
      icon: <FaPrint className="card-icon" />,
      content: 'RGB (Red, Green, Blue) is used for digital displays, while CMYK (Cyan, Magenta, Yellow, Key/Black) is used for print materials.',
      example: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00', '#000000']
    },
    {
      title: 'Color Accessibility',
      icon: <FaUniversalAccess className="card-icon" />,
      content: 'Accessible color combinations ensure content is perceivable by users with visual impairments such as color blindness.',
      example: ['#000000', '#FFFFFF', '#0074D9', '#FF4136']
    }
  ];
  
  const designTips = [
    "Limit your color palette to 3-5 colors for a cohesive look",
    "Use 60-30-10 rule: dominant color (60%), secondary color (30%), accent color (10%)",
    "Ensure sufficient contrast between text and background colors",
    "Consider cultural implications of colors in global designs",
    "Test your palette with color blindness simulators for accessibility",
    "Use color to guide attention to important elements",
    "Create visual hierarchy with strategic color placement",
    "Remember that colors appear different across various devices and environments"
  ];
  
  return (
    <section className="color-theory-section">
      <div className="color-theory-header">
        <h2 className="color-theory-title">
          <FaPalette className="title-icon" />
          The Science of Color
        </h2>
        <div className="color-wheel-container">
          <div className="color-wheel-atmosphere"></div>
          <div className="color-wheel-halo"></div>
          <div className="color-wheel"></div>
          <div className="color-wheel-border"></div>
          <div className="color-wheel-reflection"></div>
          <div className="color-wheel-texture"></div>
          <div className="color-wheel-highlight"></div>
        </div>
      </div>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', color: 'var(--gray-300)' }}>
        <FaRegCompass style={{ marginRight: '8px', color: 'var(--ou-crimson)', verticalAlign: 'middle' }} />
        Color theory is the conceptual framework that explores how humans perceive color and the visual effects of color combinations. 
        Understanding these principles can transform your design from good to exceptional.
      </p>
      
      <div className="color-theory-grid">
        {colorTheoryCards.map((card, index) => (
          <div className="theory-card" key={index}>
            <h3>{card.icon} {card.title}</h3>
            <p>{card.content}</p>
            <div className="theory-example">
              {card.example.map((color, i) => (
                <div 
                  key={i}
                  className="theory-example-segment"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <a href="#" className="read-more-link">Learn more</a>
          </div>
        ))}
      </div>
      
      {/* Interactive Color Harmony Section */}
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--ou-white)', fontWeight: '500' }}>
          <IoIosColorWand className="section-icon" />
          Explore Color Harmonies
        </h3>
        
        <div className="harmony-selector">
          {harmonyOptions.map(option => (
            <div
              key={option.id}
              className={`harmony-option ${activeHarmony === option.id ? 'active' : ''}`}
              onClick={() => setActiveHarmony(option.id)}
            >
              {option.icon} {option.label}
            </div>
          ))}
        </div>
        
        <div className="color-harmony-wheel">
          {/* Main color wheel with static gradient */}
          <div 
            style={{ 
              position: 'relative', 
              width: '300px', 
              height: '300px',
              margin: '0 auto',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)',
              boxShadow: '0 0 25px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(0, 0, 0, 0.3)',
              zIndex: 1,
              overflow: 'visible'
            }}
          >
            {/* Center point for all harmonies */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'white',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 4px rgba(0, 0, 0, 0.5)',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}></div>
            
            {/* Complementary harmony */}
            {activeHarmony === 'complementary' && (
              <>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  width: '3px',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
                  transform: 'translateX(-50%)',
                  zIndex: 5
                }}></div>
                
                {/* Top point */}
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: '50%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  transform: 'translateX(-50%)',
                  zIndex: 6
                }}></div>
                
                {/* Bottom point */}
                <div style={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '50%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  transform: 'translateX(-50%)',
                  zIndex: 6
                }}></div>
              </>
            )}
            
            {/* Analogous harmony */}
            {activeHarmony === 'analogous' && (
              <>
                {/* Sector shape */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 5,
                  pointerEvents: 'none'
                }}>
                  <path 
                    d="M 150,150 L 150,0 A 150,150 0 0,1 270,80 Z" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.8)" 
                    strokeWidth="3"
                  />
                </svg>
                
                {/* Points */}
                <div style={{
                  position: 'absolute',
                  top: '0%',
                  left: '50%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  transform: 'translate(-50%, 16px)',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  top: '15%',
                  right: '25%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  top: '26%',
                  right: '10%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
              </>
            )}
            
            {/* Triadic harmony */}
            {activeHarmony === 'triadic' && (
              <>
                {/* Triangle overlay */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 5,
                  pointerEvents: 'none'
                }}>
                  <polygon 
                    points="150,10 270,220 30,220" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.8)" 
                    strokeWidth="3"
                  />
                </svg>
                
                {/* Points */}
                <div style={{
                  position: 'absolute',
                  top: '3%',
                  left: '50%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  transform: 'translateX(-50%)',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '26%',
                  left: '10%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '26%',
                  right: '10%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
              </>
            )}
            
            {/* Split complementary harmony */}
            {activeHarmony === 'split' && (
              <>
                {/* Y shape */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 5,
                  pointerEvents: 'none'
                }}>
                  <path 
                    d="M 150,150 L 150,10 M 150,150 L 60,240 M 150,150 L 240,240" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.8)" 
                    strokeWidth="3"
                  />
                </svg>
                
                {/* Points */}
                <div style={{
                  position: 'absolute',
                  top: '3%',
                  left: '50%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  transform: 'translateX(-50%)',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '20%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '20%',
                  right: '20%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
              </>
            )}
            
            {/* Tetradic harmony */}
            {activeHarmony === 'tetradic' && (
              <>
                {/* Rectangle overlay */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 5,
                  pointerEvents: 'none'
                }}>
                  <rect 
                    x="75" 
                    y="75" 
                    width="150" 
                    height="150" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.8)" 
                    strokeWidth="3"
                  />
                </svg>
                
                {/* Points */}
                <div style={{
                  position: 'absolute',
                  top: '25%',
                  left: '25%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  top: '25%',
                  right: '25%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '25%',
                  right: '25%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '25%',
                  left: '25%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  zIndex: 6
                }}></div>
              </>
            )}
            
            {/* Monochromatic harmony */}
            {activeHarmony === 'monochromatic' && (
              <>
                {/* Concentric circles */}
                <svg style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 5,
                  pointerEvents: 'none'
                }}>
                  <circle 
                    cx="150" 
                    cy="150" 
                    r="50" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.9)" 
                    strokeWidth="3"
                  />
                  <circle 
                    cx="150" 
                    cy="150" 
                    r="85" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.7)" 
                    strokeWidth="2.5"
                  />
                  <circle 
                    cx="150" 
                    cy="150" 
                    r="120" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.5)" 
                    strokeWidth="2"
                  />
                  <line 
                    x1="150" 
                    y1="150" 
                    x2="270" 
                    y2="150" 
                    stroke="rgba(255,255,255,0.8)" 
                    strokeWidth="3"
                  />
                </svg>
                
                {/* Points on the radial line */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '33%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  transform: 'translateY(-50%)',
                  zIndex: 6
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '16%',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 0 10px white',
                  transform: 'translateY(-50%)',
                  zIndex: 6
                }}></div>
              </>
            )}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '1.5rem', 
          gap: '10px' 
        }}>
          {examples[activeHarmony].map((color, index) => (
            <div key={index} style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: color, 
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}></div>
          ))}
        </div>
      </div>
      
      {/* Design Tips Section */}
      <div className="tips-section">
        <h3><FaLightbulb className="section-icon" />Professional Color Design Tips</h3>
        <div className="tips-list">
          {designTips.map((tip, index) => (
            <div className="tip-item" key={index}>
              <div className="tip-number">
                {index + 1}
                <TbColorSwatch className="tip-icon" />
              </div>
              <div className="tip-content">{tip}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ColorTheory; 