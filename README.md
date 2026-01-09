# 🎮 Arcade Games Collection

A polished, production-ready collection of classic arcade games built with React 18, featuring Brickrush (brick breaker), 1024 (sliding puzzle), and Snake. Designed with a stunning dark glassmorphism aesthetic and optimized for both desktop and mobile devices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Vite](https://img.shields.io/badge/vite-5.0.8-purple.svg)

## ✨ Features

- **Three Classic Games**
  - 🧱 **Brickrush**: Break bricks with power-ups and 8 unique levels
  - 🔢 **1024**: Slide and merge tiles to reach 1024
  - 🐍 **Snake**: Grow your snake while avoiding collisions

- **Modern Tech Stack**
  - React 18 with hooks
  - Vite for lightning-fast development
  - Tailwind CSS for styling
  - HTML5 Canvas for game rendering
  - Vitest for testing

- **Beautiful Design**
  - Dark glassmorphism aesthetic
  - Animated gradient backgrounds
  - Smooth transitions and animations
  - Color-coded game themes

- **Responsive & Accessible**
  - Works perfectly on desktop and mobile
  - Full keyboard navigation
  - Touch and swipe gestures
  - Screen reader support
  - ARIA labels throughout

- **Performance Optimized**
  - Lazy-loaded game components
  - RequestAnimationFrame game loops
  - Memoized components
  - Optimized bundle size

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/arcade-games-collection.git
cd arcade-games-collection

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🎮 Game Controls

### Brickrush

**Desktop:**
- Mouse: Move paddle
- Arrow Keys: Move paddle
- Space: Launch ball
- P: Pause

**Mobile:**
- Drag: Move paddle
- Tap: Launch ball

### 1024

**Desktop:**
- Arrow Keys / WASD: Slide tiles
- Space: Pause

**Mobile:**
- Swipe: Slide tiles in any direction

### Snake

**Desktop:**
- Arrow Keys / WASD: Change direction
- P / Space: Pause

**Mobile:**
- Swipe: Change direction
- D-Pad: Alternative controls

## 🏗️ Architecture

### Project Structure

```
src/
├── components/          # Shared UI components
│   ├── ErrorBoundary.jsx
│   ├── BackgroundOrbs.jsx
│   ├── GradientText.jsx
│   ├── LoadingScreen.jsx
│   ├── GameSelector.jsx
│   ├── GameCard.jsx
│   ├── StartMenu.jsx
│   ├── PauseMenu.jsx
│   ├── GameOverMenu.jsx
│   ├── WinMenu.jsx
│   └── HowToPlayModal.jsx
├── games/              # Game implementations
│   ├── Brickrush/
│   │   ├── Brickrush.jsx
│   │   ├── useBrickrush.js
│   │   └── levels.js
│   ├── Puzzle1024/
│   │   ├── Puzzle1024.jsx
│   │   └── use1024.js
│   └── Snake/
│       ├── Snake.jsx
│       └── useSnake.js
├── hooks/              # Custom React hooks
│   ├── useGameLoop.js
│   ├── useHighScore.js
│   ├── useKeyboard.js
│   ├── useWindowSize.js
│   ├── useGameState.js
│   └── useControls.js
├── utils/              # Utility functions
│   ├── constants.js
│   ├── helpers.js
│   └── storage.js
├── tests/              # Test files
│   ├── setup.js
│   ├── utils/
│   └── components/
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

### Key Design Patterns

**Custom Hooks**: Each game encapsulates its logic in a custom hook (e.g., `useBrickrush`, `use1024`, `useSnake`), keeping components clean and focused on rendering.

**Game State Machine**: The `useGameState` hook manages transitions between game states (start, playing, paused, game over, won).

**Error Boundaries**: Multiple error boundaries catch and handle errors gracefully at different levels.

**Lazy Loading**: Games are lazy-loaded to reduce initial bundle size and improve loading performance.

**Storage Abstraction**: Safe localStorage wrapper handles edge cases like private browsing.

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_APP_TITLE=Arcade Games Collection
```

## 📦 Deployment

### CI/CD Pipeline

The project includes GitHub Actions workflows for:

- **CI**: Runs on PRs and pushes to main/develop
  - Linting
  - Testing
  - Building
  - Artifact upload

- **CD**: Deploys to production on main branch pushes
  - Build
  - SSH deployment

### Required Secrets

Add these secrets to your GitHub repository:

- `DEPLOY_HOST`: Server hostname
- `DEPLOY_USER`: SSH username
- `DEPLOY_KEY`: SSH private key
- `DEPLOY_PATH`: Deployment path on server

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic arcade games
- Built with modern web technologies
- Designed for accessibility and performance

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/arcade-games-collection/issues).

---

Made with ❤️ and React
