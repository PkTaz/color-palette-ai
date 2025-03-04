export class ColorLearningSystem {
  constructor() {
    this.patterns = new Map();
    this.weights = new Map();
    this.feedback = [];
  }

  async learn(colors, context, score) {
    const pattern = {
      colors,
      context,
      score,
      timestamp: Date.now()
    };

    // Store pattern
    await fetch('/api/learn-pattern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pattern)
    });

    // Update weights
    this.updateWeights(pattern);
  }

  updateWeights(pattern) {
    const key = this.getPatternKey(pattern.colors);
    const currentWeight = this.weights.get(key) || 0;
    const newWeight = currentWeight + pattern.score;
    this.weights.set(key, newWeight);
  }

  /**
   * Records user feedback about a palette
   * @param {Object} feedbackData - Data about the feedback
   * @param {string|number} feedbackData.paletteId - ID of the palette
   * @param {string} feedbackData.feedback - 'positive' or 'negative'
   * @param {string} feedbackData.businessIdea - Business context
   * @param {Date} feedbackData.timestamp - When feedback was given
   */
  recordFeedback(feedbackData) {
    // Store feedback for learning
    this.feedback.push(feedbackData);
    
    // Log feedback for debugging
    console.log('Feedback recorded:', feedbackData);
    
    // Set weights based on feedback type
    const score = feedbackData.feedback === 'positive' ? 1 : -1;
    
    // Store in localStorage for persistence
    try {
      const storedFeedback = JSON.parse(localStorage.getItem('colorFeedback') || '[]');
      storedFeedback.push(feedbackData);
      localStorage.setItem('colorFeedback', JSON.stringify(storedFeedback));
    } catch (error) {
      console.error('Error storing feedback in localStorage:', error);
    }
    
    // In a real application, send to backend
    // fetch('/api/record-feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(feedbackData)
    // }).catch(err => console.error('Failed to send feedback to server:', err));
  }

  async generatePalette(context) {
    // Get relevant patterns
    const patterns = await this.getRelevantPatterns(context);
    
    // Apply weights and select best pattern
    const weightedPatterns = patterns.map(p => ({
      ...p,
      weight: this.weights.get(this.getPatternKey(p.colors)) || 0
    }));

    // Sort by weight and return best pattern
    weightedPatterns.sort((a, b) => b.weight - a.weight);
    return weightedPatterns[0].colors;
  }

  async getRelevantPatterns(context) {
    // In a real app, this would fetch from an API or database
    // For now, return a simple default pattern if nothing is found
    
    try {
      // Try to use stored feedback
      const storedFeedback = JSON.parse(localStorage.getItem('colorFeedback') || '[]');
      
      if (storedFeedback.length > 0) {
        // Convert feedback to patterns (using only positive feedback)
        const positiveFeedback = storedFeedback.filter(f => f.feedback === 'positive');
        
        if (positiveFeedback.length > 0) {
          // Return relevant patterns based on context similarity
          return this.feedback.map(f => ({
            colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255]], // Default colors
            context: f.businessIdea,
            score: f.feedback === 'positive' ? 1 : -1
          }));
        }
      }
    } catch (error) {
      console.error('Error retrieving stored feedback:', error);
    }
    
    // Default pattern if no relevant patterns found
    return [{
      colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255]], // Default colors
      context: 'default',
      score: 0
    }];
  }

  /**
   * Generates a unique key for a color pattern
   * @param {Array} colors - Array of RGB color arrays
   * @returns {string} A unique key for the color pattern
   */
  getPatternKey(colors) {
    if (!colors || !Array.isArray(colors)) {
      return 'invalid-colors';
    }
    
    return colors.map(color => {
      if (Array.isArray(color) && color.length >= 3) {
        return `${color[0]}-${color[1]}-${color[2]}`;
      }
      return 'invalid-color';
    }).join('|');
  }
}