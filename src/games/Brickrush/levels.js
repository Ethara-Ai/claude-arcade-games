/**
 * Brick patterns for different levels
 * Each brick is represented by:
 * - row: y position (0-7)
 * - col: x position (0-9)
 * - type: 'normal' | 'steel'
 * - color: brick color
 * - powerUp: optional power-up ('multiball' | 'widePaddle')
 */

const BRICK_TYPES = {
  NORMAL: 'normal',
  STEEL: 'steel',
};

const POWER_UPS = {
  MULTI_BALL: 'multiball',
  WIDE_PADDLE: 'widePaddle',
};

// Helper to create brick rows
const createRow = (row, cols, type = BRICK_TYPES.NORMAL, color, powerUpPositions = []) => {
  return cols.map((col) => ({
    row,
    col,
    type,
    color,
    powerUp: powerUpPositions.includes(col) ? (Math.random() > 0.5 ? POWER_UPS.MULTI_BALL : POWER_UPS.WIDE_PADDLE) : null,
  }));
};

export const levels = [
  // Level 1 - Simple rows
  {
    bricks: [
      ...createRow(0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], BRICK_TYPES.NORMAL, '#06b6d4', [4, 5]),
      ...createRow(1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], BRICK_TYPES.NORMAL, '#0ea5e9'),
      ...createRow(2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], BRICK_TYPES.NORMAL, '#38bdf8'),
    ],
  },

  // Level 2 - Pyramid
  {
    bricks: [
      ...createRow(0, [4, 5], BRICK_TYPES.NORMAL, '#f59e0b'),
      ...createRow(1, [3, 4, 5, 6], BRICK_TYPES.NORMAL, '#f59e0b', [4]),
      ...createRow(2, [2, 3, 4, 5, 6, 7], BRICK_TYPES.NORMAL, '#fb923c'),
      ...createRow(3, [1, 2, 3, 4, 5, 6, 7, 8], BRICK_TYPES.NORMAL, '#fb923c', [5]),
      ...createRow(4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], BRICK_TYPES.NORMAL, '#fbbf24'),
    ],
  },

  // Level 3 - Diamond with steel
  {
    bricks: [
      ...createRow(0, [4, 5], BRICK_TYPES.NORMAL, '#10b981'),
      ...createRow(1, [3, 4, 5, 6], BRICK_TYPES.NORMAL, '#10b981'),
      ...createRow(2, [2, 3, 4, 5, 6, 7], BRICK_TYPES.STEEL, '#6b7280', [4]),
      ...createRow(3, [3, 4, 5, 6], BRICK_TYPES.NORMAL, '#34d399'),
      ...createRow(4, [4, 5], BRICK_TYPES.NORMAL, '#34d399', [4]),
    ],
  },

  // Level 4 - Checkerboard
  {
    bricks: [
      ...createRow(0, [0, 2, 4, 6, 8], BRICK_TYPES.NORMAL, '#ec4899'),
      ...createRow(1, [1, 3, 5, 7, 9], BRICK_TYPES.NORMAL, '#f472b6', [5]),
      ...createRow(2, [0, 2, 4, 6, 8], BRICK_TYPES.STEEL, '#6b7280'),
      ...createRow(3, [1, 3, 5, 7, 9], BRICK_TYPES.NORMAL, '#f472b6', [3]),
      ...createRow(4, [0, 2, 4, 6, 8], BRICK_TYPES.NORMAL, '#ec4899'),
    ],
  },

  // Level 5 - Castle
  {
    bricks: [
      ...createRow(0, [0, 1, 3, 4, 5, 6, 8, 9], BRICK_TYPES.STEEL, '#6b7280'),
      ...createRow(1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], BRICK_TYPES.NORMAL, '#8b5cf6', [5]),
      ...createRow(2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], BRICK_TYPES.NORMAL, '#a78bfa'),
      ...createRow(3, [1, 2, 3, 4, 5, 6, 7, 8], BRICK_TYPES.NORMAL, '#c4b5fd', [4, 6]),
      ...createRow(4, [2, 3, 4, 5, 6, 7], BRICK_TYPES.NORMAL, '#ddd6fe'),
    ],
  },

  // Level 6 - Wave pattern
  {
    bricks: [
      ...createRow(0, [1, 2, 3, 7, 8, 9], BRICK_TYPES.NORMAL, '#14b8a6'),
      ...createRow(1, [0, 1, 4, 5, 6, 9], BRICK_TYPES.NORMAL, '#2dd4bf', [5]),
      ...createRow(2, [0, 2, 3, 4, 6, 7, 8], BRICK_TYPES.STEEL, '#6b7280'),
      ...createRow(3, [1, 2, 5, 6, 7, 8], BRICK_TYPES.NORMAL, '#5eead4', [6]),
      ...createRow(4, [0, 3, 4, 5, 9], BRICK_TYPES.NORMAL, '#99f6e4'),
    ],
  },

  // Level 7 - X pattern
  {
    bricks: [
      ...createRow(0, [0, 1, 8, 9], BRICK_TYPES.NORMAL, '#f97316'),
      ...createRow(1, [2, 3, 6, 7], BRICK_TYPES.NORMAL, '#fb923c', [3]),
      ...createRow(2, [4, 5], BRICK_TYPES.STEEL, '#6b7280'),
      ...createRow(3, [2, 3, 6, 7], BRICK_TYPES.NORMAL, '#fdba74', [6]),
      ...createRow(4, [0, 1, 8, 9], BRICK_TYPES.NORMAL, '#fed7aa'),
      ...createRow(5, [2, 3, 6, 7], BRICK_TYPES.NORMAL, '#fb923c'),
      ...createRow(6, [4, 5], BRICK_TYPES.NORMAL, '#f97316', [4]),
    ],
  },

  // Level 8 - Final challenge
  {
    bricks: [
      ...createRow(0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], BRICK_TYPES.STEEL, '#6b7280'),
      ...createRow(1, [0, 2, 3, 4, 5, 6, 7, 9], BRICK_TYPES.NORMAL, '#ef4444', [4, 5]),
      ...createRow(2, [0, 1, 3, 4, 5, 6, 8, 9], BRICK_TYPES.NORMAL, '#f87171'),
      ...createRow(3, [0, 2, 3, 4, 5, 6, 7, 9], BRICK_TYPES.STEEL, '#6b7280'),
      ...createRow(4, [0, 1, 2, 4, 5, 7, 8, 9], BRICK_TYPES.NORMAL, '#fca5a5', [5]),
      ...createRow(5, [1, 2, 3, 4, 5, 6, 7, 8], BRICK_TYPES.NORMAL, '#fecaca'),
      ...createRow(6, [2, 3, 4, 5, 6, 7], BRICK_TYPES.STEEL, '#6b7280'),
      ...createRow(7, [3, 4, 5, 6], BRICK_TYPES.NORMAL, '#ef4444', [4]),
    ],
  },
];

export { BRICK_TYPES, POWER_UPS };
