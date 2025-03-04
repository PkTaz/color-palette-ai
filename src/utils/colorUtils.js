// Color space conversion functions
export const rgbToLab = (rgb) => {
  const [r, g, b] = rgb;
  
  // Convert RGB to XYZ
  let rLinear = r / 255.0;
  let gLinear = g / 255.0;
  let bLinear = b / 255.0;
  
  // Apply gamma correction
  rLinear = rLinear > 0.04045 ? Math.pow((rLinear + 0.055) / 1.055, 2.4) : rLinear / 12.92;
  gLinear = gLinear > 0.04045 ? Math.pow((gLinear + 0.055) / 1.055, 2.4) : gLinear / 12.92;
  bLinear = bLinear > 0.04045 ? Math.pow((bLinear + 0.055) / 1.055, 2.4) : bLinear / 12.92;
  
  // Convert to XYZ
  const x = rLinear * 0.4124 + gLinear * 0.3576 + bLinear * 0.1805;
  const y = rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722;
  const z = rLinear * 0.0193 + gLinear * 0.1192 + bLinear * 0.9505;
  
  // Convert XYZ to Lab
  const xRef = 0.95047;
  const yRef = 1.0;
  const zRef = 1.08883;
  
  const xr = x / xRef;
  const yr = y / yRef;
  const zr = z / zRef;
  
  const fx = xr > 0.008856 ? Math.pow(xr, 1/3) : (7.787 * xr) + (16/116);
  const fy = yr > 0.008856 ? Math.pow(yr, 1/3) : (7.787 * yr) + (16/116);
  const fz = zr > 0.008856 ? Math.pow(zr, 1/3) : (7.787 * zr) + (16/116);
  
  const L = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const Lab = 200 * (fy - fz);
  
  return [L, a, Lab];
};

export const labToRgb = (lab) => {
  const [L, a, b] = lab;
  
  // LAB to XYZ
  const y = (L + 16) / 116;
  const x = a / 500 + y;
  const z = y - b / 200;
  
  const xRef = 0.95047;
  const yRef = 1.0;
  const zRef = 1.08883;
  
  const x3 = x * x * x;
  const y3 = y * y * y;
  const z3 = z * z * z;
  
  let xr = x3 > 0.008856 ? x3 : (x - 16/116) / 7.787;
  let yr = y3 > 0.008856 ? y3 : (y - 16/116) / 7.787;
  let zr = z3 > 0.008856 ? z3 : (z - 16/116) / 7.787;
  
  xr = xr * xRef;
  yr = yr * yRef;
  zr = zr * zRef;
  
  // XYZ to RGB
  let r = xr * 3.2406 + yr * -1.5372 + zr * -0.4986;
  let g = xr * -0.9689 + yr * 1.8758 + zr * 0.0415;
  let bValue = xr * 0.0557 + yr * -0.2040 + zr * 1.0570;
  
  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
  bValue = bValue > 0.0031308 ? 1.055 * Math.pow(bValue, 1/2.4) - 0.055 : 12.92 * bValue;
  
  // Clamp and convert to 0-255 range
  r = Math.max(0, Math.min(1, r)) * 255;
  g = Math.max(0, Math.min(1, g)) * 255;
  bValue = Math.max(0, Math.min(1, bValue)) * 255;
  
  return [Math.round(r), Math.round(g), Math.round(bValue)];
};

const labHelper = (value) => {
  const threshold = 0.008856;
  return value > threshold ? Math.pow(value, 1/3) : (7.787 * value) + (16/116);
};

export const calculateColorDistance = (lab1, lab2) => {
  // Calculate delta E (color difference) in Lab color space
  const deltaL = lab1[0] - lab2[0];
  const deltaA = lab1[1] - lab2[1];
  const deltaB = lab1[2] - lab2[2];
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
};

export const generateHarmonious = (baseColor, type = 'analogous') => {
  const lab = rgbToLab(baseColor);
  const palette = [baseColor];
  
  switch(type) {
    case 'analogous':
      // Generate colors with similar hue but varying lightness and saturation
      for(let i = 1; i < 5; i++) {
        const variation = [
          lab[0] + (Math.random() - 0.5) * 20,  // Vary lightness
          lab[1] + (Math.random() - 0.5) * 40,  // Vary a* (red-green)
          lab[2] + (Math.random() - 0.5) * 40   // Vary b* (yellow-blue)
        ];
        palette.push(labToRgb(variation));
      }
      break;
    // Add more harmony types here
  }
  
  return palette;
};

// Color naming utility
export const getColorNameFromRGB = (rgb) => {
  const [r, g, b] = rgb;
  const hexCode = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  
  // Color name mapping with common and specific color names
  const colorNames = {
    // Reds
    '#ff0000': 'Pure Red',
    '#cd5c5c': 'Indian Red',
    '#b22222': 'Firebrick',
    '#8b0000': 'Dark Red',
    '#dc143c': 'Crimson',
    '#c71585': 'Medium Violet Red',
    '#ff1493': 'Deep Pink',
    '#ff69b4': 'Hot Pink',
    '#ffc0cb': 'Pink',
    
    // Oranges
    '#ff4500': 'Orange Red',
    '#ff6347': 'Tomato',
    '#ff7f50': 'Coral',
    '#ffa500': 'Orange',
    '#ff8c00': 'Dark Orange',
    '#ffa07a': 'Light Salmon',
    
    // Yellows
    '#ffff00': 'Yellow',
    '#ffffe0': 'Light Yellow',
    '#fffacd': 'Lemon Chiffon',
    '#ffd700': 'Gold',
    '#eee8aa': 'Pale Goldenrod',
    '#f0e68c': 'Khaki',
    '#bdb76b': 'Dark Khaki',
    
    // Greens
    '#008000': 'Green',
    '#006400': 'Dark Green',
    '#228b22': 'Forest Green',
    '#32cd32': 'Lime Green',
    '#00ff00': 'Lime',
    '#7fff00': 'Chartreuse',
    '#adff2f': 'Green Yellow',
    '#9acd32': 'Yellow Green',
    '#00fa9a': 'Medium Spring Green',
    '#00ff7f': 'Spring Green',
    '#90ee90': 'Light Green',
    '#98fb98': 'Pale Green',
    '#8fbc8f': 'Dark Sea Green',
    '#66cdaa': 'Medium Aquamarine',
    '#3cb371': 'Medium Sea Green',
    '#2e8b57': 'Sea Green',
    '#808000': 'Olive',
    '#556b2f': 'Dark Olive Green',
    '#6b8e23': 'Olive Drab',
    
    // Cyans
    '#00ffff': 'Cyan',
    '#afeeee': 'Pale Turquoise',
    '#7fffd4': 'Aquamarine',
    '#40e0d0': 'Turquoise',
    '#48d1cc': 'Medium Turquoise',
    '#00ced1': 'Dark Turquoise',
    '#20b2aa': 'Light Sea Green',
    '#5f9ea0': 'Cadet Blue',
    '#008b8b': 'Dark Cyan',
    '#008080': 'Teal',
    
    // Blues
    '#0000ff': 'Blue',
    '#0000cd': 'Medium Blue',
    '#00008b': 'Dark Blue',
    '#191970': 'Midnight Blue',
    '#4169e1': 'Royal Blue',
    '#4682b4': 'Steel Blue',
    '#1e90ff': 'Dodger Blue',
    '#00bfff': 'Deep Sky Blue',
    '#87ceeb': 'Sky Blue',
    '#87cefa': 'Light Sky Blue',
    '#b0c4de': 'Light Steel Blue',
    '#add8e6': 'Light Blue',
    '#b0e0e6': 'Powder Blue',
    '#afeeee': 'Pale Turquoise',
    
    // Purples
    '#800080': 'Purple',
    '#8b008b': 'Dark Magenta',
    '#9370db': 'Medium Purple',
    '#9932cc': 'Dark Orchid',
    '#ba55d3': 'Medium Orchid',
    '#da70d6': 'Orchid',
    '#dda0dd': 'Plum',
    '#ee82ee': 'Violet',
    '#d8bfd8': 'Thistle',
    '#ff00ff': 'Magenta',
    '#ff00ff': 'Fuchsia',
    '#4b0082': 'Indigo',
    '#8a2be2': 'Blue Violet',
    '#9400d3': 'Dark Violet',
    
    // Browns
    '#a52a2a': 'Brown',
    '#8b4513': 'Saddle Brown',
    '#a0522d': 'Sienna',
    '#cd853f': 'Peru',
    '#deb887': 'Burlywood',
    '#d2b48c': 'Tan',
    '#bc8f8f': 'Rosy Brown',
    '#f4a460': 'Sandy Brown',
    '#daa520': 'Goldenrod',
    '#b8860b': 'Dark Goldenrod',
    
    // Whites/Grays/Blacks
    '#ffffff': 'White',
    '#fffafa': 'Snow',
    '#f0fff0': 'Honeydew',
    '#f5fffa': 'Mint Cream',
    '#f0ffff': 'Azure',
    '#f0f8ff': 'Alice Blue',
    '#f8f8ff': 'Ghost White',
    '#f5f5f5': 'White Smoke',
    '#fff5ee': 'Seashell',
    '#f5f5dc': 'Beige',
    '#fdf5e6': 'Old Lace',
    '#fffaf0': 'Floral White',
    '#fffff0': 'Ivory',
    '#faebd7': 'Antique White',
    '#faf0e6': 'Linen',
    '#fff0f5': 'Lavender Blush',
    '#ffe4e1': 'Misty Rose',
    '#dcdcdc': 'Gainsboro',
    '#d3d3d3': 'Light Gray',
    '#c0c0c0': 'Silver',
    '#a9a9a9': 'Dark Gray',
    '#808080': 'Gray',
    '#696969': 'Dim Gray',
    '#778899': 'Light Slate Gray',
    '#708090': 'Slate Gray',
    '#2f4f4f': 'Dark Slate Gray',
    '#000000': 'Black'
  };

  // Find exact match
  if (colorNames[hexCode.toUpperCase()]) {
    return colorNames[hexCode.toUpperCase()];
  }

  // Find closest color
  let closestColor = '';
  let minDistance = Number.MAX_VALUE;

  // Helper to calculate color distance
  const colorDistance = (hex1, hex2) => {
    // Convert hex to RGB
    const rgb1 = [
      parseInt(hex1.slice(1, 3), 16),
      parseInt(hex1.slice(3, 5), 16),
      parseInt(hex1.slice(5, 7), 16)
    ];
    
    const rgb2 = [
      parseInt(hex2.slice(1, 3), 16),
      parseInt(hex2.slice(3, 5), 16),
      parseInt(hex2.slice(5, 7), 16)
    ];
    
    // Calculate Euclidean distance
    return Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    );
  };

  // Find closest color from our palette
  Object.keys(colorNames).forEach(hex => {
    const distance = colorDistance(hexCode, hex);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = colorNames[hex];
    }
  });

  // Add brightness/shade modifiers for more precise naming
  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
  let brightnessModifier = '';
  
  if (brightness < 40) brightnessModifier = 'Very Dark ';
  else if (brightness < 85) brightnessModifier = 'Dark ';
  else if (brightness > 240) brightnessModifier = 'Very Light ';
  else if (brightness > 170) brightnessModifier = 'Light ';
  
  // Only apply modifier if it's not redundant with existing name
  if (!closestColor.includes(brightnessModifier.trim())) {
    return brightnessModifier + closestColor;
  }
  
  return closestColor;
};