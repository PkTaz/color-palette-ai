# 🎨 RepTools Color Studio

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/Anthropic%20Claude-7F52FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiLz48Y2lyY2xlIGZpbGw9IndoaXRlIiBjeD0iMTIiIGN5PSIxMiIgcj0iNSIvPjwvc3ZnPg==" alt="Claude AI"/>
</div>

## 📋 Overview

RepTools Color Studio is an advanced AI-powered color palette generator designed to transform business ideas and brand concepts into cohesive, psychologically effective color schemes. The application integrates AI capabilities with color theory principles to deliver professional-grade palettes that communicate brand values and evoke specific emotional responses from target audiences.

### 🌟 Key Problem Solved

Traditional color selection tools fail to account for industry-specific standards, psychological impact, and brand context. RepTools Color Studio bridges this gap by implementing AI models that analyze these factors to generate contextual, meaningful color palettes that directly connect with business objectives and target demographics.

<div align="center">
  <img src="docs/screenshots/app-preview.png" alt="RepTools Color Studio Interface" width="800"/>
</div>

## ✨ Features

- **AI-Powered Color Generation**: Transform text descriptions into harmonious color palettes with Claude AI
- **Learning System**: Adapts to preferences through feedback for personalized results
- **Color Psychology Analysis**: Maps colors to emotional responses and industry contexts
- **Color Theory Visualization**: Interactive displays of color relationships and harmonies
- **Accessibility Scoring**: WCAG compliance checking for generated color schemes
- **Image Extraction**: Generate palettes from uploaded images
- **Save & Export**: Store favorite palettes for future reference
- **Smooth, Interactive UI**: Polished user experience with animations and responsive design
- **Color Naming**: Intelligent naming based on color properties and industry standards

## 🛠️ Technology Stack

### Frontend
- **React**: Component-based UI architecture
- **CSS3**: Advanced animations, transitions, and responsive design
- **JavaScript (ES6+)**: Modern JS for interactive features

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **RESTful API**: For communication between client and server

### AI & Data Processing
- **Claude AI**: For natural language processing and color generation
- **Custom Learning System**: Self-improving algorithm for color preferences
- **Color Theory Algorithms**: Mathematical models for color harmonies and relationships

### Development Tools
- **Git**: Version control for collaborative development
- **npm**: Package management
- **Webpack**: Module bundling
- **ESLint**: Code quality control

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/PkTaz/color-palette-ai.git
   cd color-palette-ai
   ```

2. **Install dependencies for frontend**
   ```bash
   npm install
   ```

3. **Install dependencies for backend**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   - Create a `.env` file in the backend directory
   - Add required API keys and configuration variables:
   ```
   PORT=5000
   CLAUDE_API_KEY=your_claude_api_key_here
   NODE_ENV=development
   ```

5. **Start the development servers**
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # In another terminal, start frontend
   cd ..
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 🧠 Architecture & Implementation

### Color Learning System

The heart of RepTools Color Studio is its sophisticated learning system that:

1. **Captures User Feedback**: Records user likes/dislikes on generated palettes
2. **Identifies Patterns**: Analyzes color combinations that receive positive feedback
3. **Adjusts Weights**: Updates internal weighting system for future generations
4. **Contextual Awareness**: Considers industry and demographic factors
5. **Progressive Enhancement**: Continuously improves with more user interaction

```javascript
// Simplified snippet of the adaptive learning system
class ColorLearningSystem {
  // Records user preferences for future reference
  recordFeedback(colors, isPositive) {
    const patternKey = this.getPatternKey(colors);
    // Update weights based on user feedback
    this.updateWeights(patternKey, isPositive);
  }
  
  // Generate palettes influenced by past preferences
  generatePalette(baseColor, context) {
    const relevantPatterns = this.getRelevantPatterns(context);
    return this.applyPatterns(baseColor, relevantPatterns);
  }
}
```

### Color Theory Implementation

The application implements advanced color theory principles:

- **Complementary**: Colors opposite on the color wheel
- **Analogous**: Colors adjacent on the color wheel
- **Triadic**: Colors evenly spaced around the color wheel
- **Split-Complementary**: A base color and two colors adjacent to its complement
- **Tetradic**: Four colors arranged in two complementary pairs

<div align="center">
  <img src="docs/diagrams/color-theory-wheel.png" alt="Color Theory Visualization" width="500"/>
</div>

### AI Integration

Claude AI is integrated for:

1. **Natural Language Processing**: Understanding business descriptions
2. **Context Extraction**: Identifying industry, mood, and target audience
3. **Color Mapping**: Translating concepts to appropriate color values
4. **Description Generation**: Creating meaningful explanations for generated palettes

## 🔍 Development Process & Challenges Overcome

### Iterative Development
The project followed an iterative development approach with multiple rounds of:

1. **Prototype**: Initial concepts and wireframes
2. **Implementation**: Development of key features
3. **Testing**: User testing and feedback collection
4. **Refinement**: Improvements based on insights

### Key Challenges Solved

- **AI Integration**: Creating a reliable communication layer between the frontend and Claude AI
- **Color Theory Algorithms**: Implementing mathematically accurate color transformations
- **Learning System**: Developing a system that improves with user interaction without explicit training
- **Performance Optimization**: Ensuring smooth animations and transitions even with complex calculations
- **Responsive Design**: Creating a consistent experience across all device sizes

## 🔮 Future Roadmap

- **Advanced Color Extraction**: More sophisticated image analysis for palette generation
- **Export Options**: Additional format support for design software integration
- **Collaboration Features**: Team workspaces for design collaboration
- **Industry Templates**: Pre-configured settings for common business categories
- **Accessibility Expansion**: More comprehensive accessibility tools and guidance
- **3D Color Space Visualization**: Interactive 3D representations of color relationships

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 About the Developer

Developed by [Your Name] as a demonstration of full-stack development skills, AI integration capabilities, and UI/UX design principles.

---

<div align="center">
  <p>Made with ❤️ using React, Node.js, and Claude AI</p>
</div>
