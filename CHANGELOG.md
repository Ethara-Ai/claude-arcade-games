# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-10

### Added

#### Core Features
- Three classic arcade games: Brickrush, 1024, and Snake
- Beautiful loading screen with animated progress bar
- Game selector hub with keyboard shortcuts
- Dark glassmorphism UI aesthetic
- Animated gradient backgrounds with floating orbs

#### Games
- **Brickrush**: Brick breaker with 8 unique levels, power-ups, and responsive controls
- **1024**: Sliding puzzle game with smooth animations and tile merging
- **Snake**: Classic snake with bonus food, increasing difficulty, and D-pad controls

#### UI Components
- Shared menu system (Start, Pause, Game Over, Win menus)
- How to Play modal with controls and tips
- Error boundaries for graceful error handling
- Responsive design for desktop and mobile

#### Custom Hooks
- `useGameLoop`: RequestAnimationFrame game loop with delta time
- `useHighScore`: LocalStorage-based high score persistence
- `useKeyboard`: Configurable keyboard input handling
- `useWindowSize`: Responsive breakpoint detection
- `useGameState`: Game state machine management
- `useControls`: Unified keyboard and touch controls with swipe detection

#### Developer Experience
- Vite for fast development and building
- ESLint and Prettier for code quality
- Vitest for testing with coverage
- PropTypes for type checking
- CI/CD pipelines with GitHub Actions

#### Accessibility
- Full keyboard navigation
- ARIA labels and roles
- Screen reader support
- Focus management in modals
- Reduced motion support
- High color contrast

#### Performance
- Lazy loading for game components
- Code splitting for vendor bundles
- Optimized canvas rendering
- Memoized components
- RequestAnimationFrame for smooth animations

### Technical Details
- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.4.0
- Vitest 1.0.4

## [Unreleased]

### Planned
- Additional games (Tetris, Pong, etc.)
- Multiplayer support
- Leaderboards
- Achievements system
- Sound effects and music
- Progressive Web App (PWA) support
- Game replays
- Custom themes
