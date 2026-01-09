// Game Configuration Constants

export const GAMES = {
  BRICKRUSH: 'brickrush',
  PUZZLE_1024: '1024',
  SNAKE: 'snake',
};

export const GAME_COLORS = {
  [GAMES.BRICKRUSH]: {
    primary: '#06b6d4', // cyan
    glow: 'shadow-glow-cyan',
    border: 'border-accent-cyan',
    text: 'text-accent-cyan',
    btn: 'btn-glass-cyan',
  },
  [GAMES.PUZZLE_1024]: {
    primary: '#f59e0b', // amber
    glow: 'shadow-glow-amber',
    border: 'border-accent-amber',
    text: 'text-accent-amber',
    btn: 'btn-glass-amber',
  },
  [GAMES.SNAKE]: {
    primary: '#10b981', // green
    glow: 'shadow-glow-green',
    border: 'border-accent-green',
    text: 'text-accent-green',
    btn: 'btn-glass-green',
  },
};

export const GAME_INFO = {
  [GAMES.BRICKRUSH]: {
    name: 'Brickrush',
    description: 'Classic brick breaker with power-ups and multiple levels',
    tags: ['Action', 'Arcade', 'Canvas'],
    controls: {
      desktop: [
        { key: 'Mouse', action: 'Move paddle' },
        { key: 'Arrow Keys', action: 'Move paddle' },
        { key: 'Space', action: 'Launch ball' },
        { key: 'P', action: 'Pause' },
      ],
      mobile: [
        { key: 'Drag', action: 'Move paddle' },
        { key: 'Tap', action: 'Launch ball' },
      ],
    },
    tips: [
      'Aim for the corners to reach difficult bricks',
      'Catch power-ups to gain advantages',
      'Steel bricks cannot be destroyed',
      'Each level increases your score multiplier',
    ],
  },
  [GAMES.PUZZLE_1024]: {
    name: '1024',
    description: 'Slide and merge tiles to reach 1024',
    tags: ['Puzzle', 'Strategy', 'Brain'],
    controls: {
      desktop: [
        { key: 'Arrow Keys', action: 'Slide tiles' },
        { key: 'WASD', action: 'Slide tiles' },
        { key: 'Space', action: 'Pause' },
      ],
      mobile: [
        { key: 'Swipe', action: 'Slide tiles' },
      ],
    },
    tips: [
      'Keep your highest tile in a corner',
      'Build tiles in a snake pattern',
      'Plan moves ahead to avoid filling the board',
      'Merging creates the sum of both tiles',
    ],
  },
  [GAMES.SNAKE]: {
    name: 'Snake',
    description: 'Guide the snake to eat food and grow longer',
    tags: ['Classic', 'Arcade', 'Canvas'],
    controls: {
      desktop: [
        { key: 'Arrow Keys', action: 'Change direction' },
        { key: 'WASD', action: 'Change direction' },
        { key: 'P / Space', action: 'Pause' },
      ],
      mobile: [
        { key: 'Swipe', action: 'Change direction' },
        { key: 'D-Pad', action: 'Change direction' },
      ],
    },
    tips: [
      'Golden food gives bonus points',
      'Speed increases as you score more',
      'Plan your path to avoid trapping yourself',
      "Don't reverse into yourself",
    ],
  },
};

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
};

export const STORAGE_KEYS = {
  HIGH_SCORE_BRICKRUSH: 'arcade_highscore_brickrush',
  HIGH_SCORE_1024: 'arcade_highscore_1024',
  HIGH_SCORE_SNAKE: 'arcade_highscore_snake',
};

export const GAME_STATES = {
  START: 'start',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  WON: 'won',
};
