import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  isStorageAvailable,
} from '../../utils/storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getStorageItem', () => {
    it('should get item from storage', () => {
      localStorage.setItem('test', JSON.stringify({ value: 123 }));
      expect(getStorageItem('test')).toEqual({ value: 123 });
    });

    it('should return default value if item does not exist', () => {
      expect(getStorageItem('nonexistent', 'default')).toBe('default');
    });
  });

  describe('setStorageItem', () => {
    it('should set item in storage', () => {
      setStorageItem('test', { value: 456 });
      expect(JSON.parse(localStorage.getItem('test'))).toEqual({ value: 456 });
    });
  });

  describe('removeStorageItem', () => {
    it('should remove item from storage', () => {
      localStorage.setItem('test', 'value');
      removeStorageItem('test');
      expect(localStorage.getItem('test')).toBeNull();
    });
  });

  describe('clearStorage', () => {
    it('should clear all storage', () => {
      localStorage.setItem('test1', 'value1');
      localStorage.setItem('test2', 'value2');
      clearStorage();
      expect(localStorage.getItem('test1')).toBeNull();
      expect(localStorage.getItem('test2')).toBeNull();
    });
  });

  describe('isStorageAvailable', () => {
    it('should check if storage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });
  });
});
