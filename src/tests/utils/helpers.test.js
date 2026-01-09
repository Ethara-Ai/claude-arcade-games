import { describe, it, expect } from 'vitest';
import {
  clamp,
  lerp,
  mapRange,
  randomInt,
  randomFloat,
  rectCollision,
  pointInRect,
  distance,
  formatNumber,
  formatTime,
} from '../../utils/helpers';

describe('Helper Functions', () => {
  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate between values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });
  });

  describe('mapRange', () => {
    it('should map value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
      expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
      expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
    });
  });

  describe('randomInt', () => {
    it('should generate random integer in range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('randomFloat', () => {
    it('should generate random float in range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(1.0, 10.0);
        expect(result).toBeGreaterThanOrEqual(1.0);
        expect(result).toBeLessThanOrEqual(10.0);
      }
    });
  });

  describe('rectCollision', () => {
    it('should detect rectangle collision', () => {
      const rect1 = { x: 0, y: 0, width: 10, height: 10 };
      const rect2 = { x: 5, y: 5, width: 10, height: 10 };
      const rect3 = { x: 20, y: 20, width: 10, height: 10 };

      expect(rectCollision(rect1, rect2)).toBe(true);
      expect(rectCollision(rect1, rect3)).toBe(false);
    });
  });

  describe('pointInRect', () => {
    it('should detect if point is in rectangle', () => {
      const rect = { x: 0, y: 0, width: 10, height: 10 };

      expect(pointInRect(5, 5, rect)).toBe(true);
      expect(pointInRect(15, 15, rect)).toBe(false);
    });
  });

  describe('distance', () => {
    it('should calculate distance between points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5);
      expect(distance(0, 0, 0, 0)).toBe(0);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(100)).toBe('100');
    });
  });

  describe('formatTime', () => {
    it('should format time in MM:SS', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(600)).toBe('10:00');
    });
  });
});
