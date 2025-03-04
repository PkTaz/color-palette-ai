export const industryColors = {
  technology: {
    recommended: ['blue', 'gray', 'white'],
    meanings: 'Tech companies often use blue to convey trust and reliability',
    examples: ['IBM', 'Microsoft', 'Intel']
  },
  healthcare: {
    recommended: ['blue', 'green', 'white'],
    meanings: 'Healthcare brands use calming blues and healing greens',
    examples: ['Blue Cross', 'Mayo Clinic', 'CVS']
  },
  food: {
    recommended: ['red', 'yellow', 'green'],
    meanings: 'Food industry uses appetizing warm colors',
    examples: ['McDonald\'s', 'Subway', 'Whole Foods']
  },
  general: {
    recommended: ['blue', 'black', 'gray'],
    meanings: 'Professional and versatile color combination',
    examples: ['Various Industries']
  }
};

export const culturalMeanings = {
  western: {
    red: 'Passion, energy, danger',
    blue: 'Trust, stability, professionalism',
    green: 'Nature, growth, wealth',
    yellow: 'Optimism, happiness, warning',
    purple: 'Royalty, luxury, creativity',
    orange: 'Enthusiasm, adventure, confidence',
    black: 'Power, elegance, sophistication',
    white: 'Purity, cleanliness, simplicity',
    gray: 'Balance, neutrality, calmness'
  },
  eastern: {
    red: 'Good fortune, celebration, happiness',
    blue: 'Immortality, healing',
    green: 'Eternity, family, health',
    yellow: 'Imperial power, royalty',
    purple: 'Spirituality, nobility',
    orange: 'Change, adaptability, courage',
    black: 'Career, knowledge, power',
    white: 'Death, mourning, purity',
    gray: 'Modesty, helpfulness'
  }
};

export const emotionalImpact = {
  red: ['Excitement', 'Urgency', 'Passion'],
  blue: ['Trust', 'Calm', 'Reliability'],
  green: ['Growth', 'Health', 'Harmony'],
  yellow: ['Joy', 'Energy', 'Optimism'],
  purple: ['Luxury', 'Mystery', 'Wisdom'],
  orange: ['Fun', 'Confidence', 'Sociability'],
  black: ['Prestige', 'Value', 'Power'],
  white: ['Clarity', 'Purity', 'Simplicity'],
  gray: ['Balance', 'Neutrality', 'Calm'],
  neutral: ['Versatility', 'Adaptability', 'Balance']
};

export const brandPersonality = {
  professional: {
    primary: ['blue', 'gray', 'black'],
    accent: ['gold', 'silver'],
    description: 'Conservative and reliable'
  },
  creative: {
    primary: ['purple', 'orange', 'pink'],
    accent: ['yellow', 'teal'],
    description: 'Innovative and imaginative'
  },
  // Add more personalities...
};

export const detectIndustry = (description = '') => {
  const industryKeywords = {
    technology: ['tech', 'software', 'digital', 'app', 'computer', 'IT', 'website', 'online'],
    healthcare: ['health', 'medical', 'wellness', 'clinic', 'hospital', 'care', 'therapy'],
    food: ['restaurant', 'food', 'cafe', 'catering', 'bakery', 'dining'],
    fashion: ['fashion', 'clothing', 'apparel', 'boutique', 'jewelry', 'accessories'],
    finance: ['bank', 'finance', 'investment', 'accounting', 'insurance', 'financial'],
    education: ['school', 'education', 'learning', 'teaching', 'academic', 'training'],
    entertainment: ['entertainment', 'game', 'music', 'film', 'media', 'creative'],
    general: [] // fallback
  };

  const lowercaseDesc = description.toLowerCase();
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword => lowercaseDesc.includes(keyword))) {
      return industry;
    }
  }
  return 'general';
};