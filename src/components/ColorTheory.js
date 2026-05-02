import React, { useMemo, useCallback, useRef, useState } from 'react';
import {
  FaPalette,
  FaBrain,
  FaUniversalAccess,
  FaPrint,
  FaLightbulb,
  FaRegCompass,
} from 'react-icons/fa';
import { MdInvertColors, MdOutlineGridOn } from 'react-icons/md';
import { IoIosColorPalette, IoIosColorWand } from 'react-icons/io';
import {
  BiCircle,
  BiCircleHalf,
  BiCircleThreeQuarter,
  BiCircleQuarter,
} from 'react-icons/bi';
import { TbColorSwatch } from 'react-icons/tb';

const WHEEL = 300;
const CX = WHEEL / 2;
const RIM = (WHEEL / 2) * 0.92;

function normHue(h) {
  return ((h % 360) + 360) % 360;
}

/** Top of wheel = 0° (red), clockwise increases hue (matches conic-gradient). */
function hueToXY(hue, r = RIM) {
  const rad = (hue * Math.PI) / 180;
  return {
    x: CX + r * Math.sin(rad),
    y: CX - r * Math.cos(rad),
  };
}

function pointerToHue(clientX, clientY, rect) {
  const x = clientX - rect.left - rect.width / 2;
  const y = clientY - rect.top - rect.height / 2;
  const hue = (Math.atan2(x, -y) * 180) / Math.PI;
  return normHue(hue);
}

const HARMONY_COPY = {
  complementary:
    'Two colors opposite on the wheel (180° apart). Strong contrast—pair a dominant with an accent.',
  analogous:
    'Neighbors on the wheel (~±30° from base). Cohesive and calm; great for brand systems.',
  triadic:
    'Three hues evenly spaced (120°). Balanced energy without the tension of complements.',
  split:
    'Base hue plus two neighbors of its complement (150° & 210°). Contrast with less vibration than pure complementary.',
  tetradic:
    'Four hues in a rectangle (90° steps). Rich palette—watch balance so it does not feel busy.',
  monochromatic:
    'One hue, varied lightness. Sophisticated and foolproof; use saturation steps for depth.',
};

function harmonyAngles(type, baseHue) {
  const b = normHue(baseHue);
  const n = normHue;
  switch (type) {
    case 'complementary':
      return [b, n(b + 180)];
    case 'analogous':
      return [n(b - 30), b, n(b + 30)];
    case 'triadic':
      return [b, n(b + 120), n(b + 240)];
    case 'split':
      return [b, n(b + 150), n(b + 210)];
    case 'tetradic':
      return [b, n(b + 90), n(b + 180), n(b + 270)];
    case 'monochromatic':
      return [b];
    default:
      return [b];
  }
}

function swatchesForHarmony(type, baseHue, hues) {
  if (type === 'monochromatic') {
    const b = normHue(baseHue);
    return [32, 44, 56, 68, 80].map((L) => ({
      css: `hsl(${b}, 68%, ${L}%)`,
      label: `${L}% L`,
    }));
  }
  return hues.map((h) => ({
    css: `hsl(${normHue(h)}, 72%, 48%)`,
    label: `${Math.round(normHue(h))}°`,
  }));
}

const ColorTheory = () => {
  const [activeHarmony, setActiveHarmony] = useState('complementary');
  const [baseHue, setBaseHue] = useState(12);
  const wheelRef = useRef(null);

  const harmonyOptions = [
    { id: 'complementary', label: 'Complementary', icon: <BiCircleHalf className="harmony-icon" /> },
    { id: 'analogous', label: 'Analogous', icon: <BiCircleQuarter className="harmony-icon" /> },
    { id: 'triadic', label: 'Triadic', icon: <BiCircle className="harmony-icon" /> },
    { id: 'split', label: 'Split', icon: <BiCircleThreeQuarter className="harmony-icon" /> },
    { id: 'tetradic', label: 'Tetradic', icon: <MdOutlineGridOn className="harmony-icon" /> },
    { id: 'monochromatic', label: 'Monochromatic', icon: <MdInvertColors className="harmony-icon" /> },
  ];

  const examples = useMemo(
    () => ({
      complementary: ['#FF4D4D', '#4DD9FF'],
      analogous: ['#FF6B35', '#F7931E', '#FDC830'],
      triadic: ['#E63946', '#2A9D8F', '#457B9D'],
      split: ['#E63946', '#06D6A0', '#118AB2'],
      tetradic: ['#E63946', '#F4A261', '#2A9D8F', '#264653'],
      monochromatic: ['#3D0A5C', '#6B1F8C', '#9B4DCA', '#C77DFF', '#E9D5FF'],
    }),
    []
  );

  const hues = useMemo(
    () => harmonyAngles(activeHarmony, baseHue),
    [activeHarmony, baseHue]
  );

  const swatches = useMemo(
    () => swatchesForHarmony(activeHarmony, baseHue, hues),
    [activeHarmony, baseHue, hues]
  );

  const handleWheelPick = useCallback((e) => {
    const el = wheelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setBaseHue(pointerToHue(e.clientX, e.clientY, rect));
  }, []);

  const colorTheoryCards = [
    {
      title: 'Color Psychology',
      icon: <FaBrain className="card-icon" />,
      content:
        'Colors evoke emotional and psychological responses. For example, blue promotes trust and calm, while red creates urgency and excitement.',
      example: ['#0062B8', '#D73A49', '#28A745', '#FFCA28'],
    },
    {
      title: 'Color Harmonies',
      icon: <IoIosColorPalette className="card-icon" />,
      content:
        'Harmonies are geometric relationships on the color wheel. Use the playground below to see how each type maps from a base hue.',
      example: examples[activeHarmony],
    },
    {
      title: 'RGB vs CMYK',
      icon: <FaPrint className="card-icon" />,
      content:
        'RGB (Red, Green, Blue) is used for digital displays, while CMYK (Cyan, Magenta, Yellow, Key/Black) is used for print materials.',
      example: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00', '#000000'],
    },
    {
      title: 'Color Accessibility',
      icon: <FaUniversalAccess className="card-icon" />,
      content:
        'Accessible color combinations ensure content is perceivable by users with visual impairments such as color blindness.',
      example: ['#000000', '#FFFFFF', '#0074D9', '#FF4136'],
    },
  ];

  const designTips = [
    'Limit your palette to 3–5 colors for a cohesive look',
    'Use the 60-30-10 rule: dominant (60%), secondary (30%), accent (10%)',
    'Ensure sufficient contrast between text and background (WCAG)',
    'Consider cultural implications of colors in global designs',
    'Test palettes with color-blindness simulators before launch',
    'Use color to guide attention to primary actions',
    'Build hierarchy with saturation and lightness, not only hue',
    'Remember displays differ—validate on real devices when possible',
  ];

  return (
    <section className="color-theory-section">
      <div className="color-theory-header">
        <h2 className="color-theory-title">
          <FaPalette className="title-icon" />
          Color theory &amp; harmonies
        </h2>
        <div className="color-wheel-container">
          <div className="color-wheel-atmosphere" />
          <div className="color-wheel-halo" />
          <div className="color-wheel" />
          <div className="color-wheel-reflection" />
          <div className="color-wheel-texture" />
        </div>
      </div>

      <p className="color-theory-intro">
        <FaRegCompass className="color-theory-intro-icon" aria-hidden />
        Color theory explains how we perceive hue, saturation, and lightness—and how combinations feel harmonious or tense.
        <strong> ColorPal AI</strong> uses these same ideas when it builds your palettes.
      </p>

      <div className="color-theory-grid">
        {colorTheoryCards.map((card, index) => (
          <div className="theory-card" key={card.title}>
            <h3>
              {card.icon} {card.title}
            </h3>
            <p>{card.content}</p>
            <div className="theory-example">
              {card.example.map((color, i) => (
                <div
                  key={i}
                  className="theory-example-segment"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="read-more-link" role="presentation">
              Explore
            </span>
          </div>
        ))}
      </div>

      <div className="harmony-playground">
        <h3 className="harmony-playground-title">
          <IoIosColorWand className="section-icon" aria-hidden />
          Harmony playground
        </h3>
        <p className="harmony-playground-lead">
          Set a <strong>base hue</strong> by clicking the wheel or using the slider. White spokes mark each color in the
          selected harmony; swatches show sample colors at readable lightness.
        </p>

        <div className="harmony-playground-grid">
          <div className="harmony-wheel-column">
            <div
              ref={wheelRef}
              className="harmony-wheel-wrap"
              style={{ width: WHEEL, height: WHEEL }}
              onClick={handleWheelPick}
              role="application"
              aria-label="Color wheel: click to set base hue"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                  setBaseHue((h) => normHue(h + 3));
                }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                  setBaseHue((h) => normHue(h - 3));
                }
              }}
            >
              <div
                className="harmony-wheel-disk"
                style={{
                  background:
                    'conic-gradient(hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
                }}
              />
              <svg
                className="harmony-spokes-svg"
                width={WHEEL}
                height={WHEEL}
                viewBox={`0 0 ${WHEEL} ${WHEEL}`}
                aria-hidden
              >
                {hues.map((h) => {
                  const p = hueToXY(h, RIM);
                  return (
                    <line
                      key={`spoke-${h}-${activeHarmony}`}
                      x1={CX}
                      y1={CX}
                      x2={p.x}
                      y2={p.y}
                      stroke="rgba(255,255,255,0.92)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              {hues.map((h) => {
                const p = hueToXY(h, RIM);
                const isBase = Math.round(normHue(h)) === Math.round(normHue(baseHue));
                return (
                  <div
                    key={`dot-${h}-${activeHarmony}`}
                    className={`harmony-marker-dot${isBase ? ' is-base' : ''}`}
                    style={{ left: p.x, top: p.y }}
                  />
                );
              })}
              <div className="harmony-wheel-hub" />
            </div>
            <p className="harmony-wheel-hint">
              Click the wheel (or use arrow keys while focused) to move the base hue.
            </p>
            <div className="harmony-hue-slider">
              <label htmlFor="harmony-hue-range">
                Base hue: <strong>{Math.round(normHue(baseHue))}°</strong>
              </label>
              <input
                id="harmony-hue-range"
                type="range"
                min={0}
                max={360}
                value={Math.round(normHue(baseHue))}
                onChange={(e) => setBaseHue(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="harmony-controls-column">
            <div className="harmony-selector" role="tablist" aria-label="Harmony type">
              {harmonyOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={activeHarmony === option.id}
                  className={`harmony-option ${activeHarmony === option.id ? 'active' : ''}`}
                  onClick={() => setActiveHarmony(option.id)}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
            <p className="harmony-type-blurb">{HARMONY_COPY[activeHarmony]}</p>
            <div className="harmony-swatch-row">
              {swatches.map((s, i) => (
                <div className="harmony-swatch" key={`${s.css}-${i}`}>
                  <div
                    className="harmony-swatch-color"
                    style={{ backgroundColor: s.css }}
                    title={s.css}
                  />
                  <span className="harmony-swatch-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tips-section">
        <h3>
          <FaLightbulb className="section-icon" />
          Professional color tips
        </h3>
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
