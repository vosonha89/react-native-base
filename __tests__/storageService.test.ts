import { jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../src/services/logic/storageService';

describe('StorageService', () => {
  let service: StorageService;
  const mockAsync = AsyncStorage as any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StorageService();
  });

  test('save/get/delete/clear flow', async () => {
    mockAsync.setItem.mockResolvedValue(undefined);
    mockAsync.getItem.mockResolvedValue(JSON.stringify({ a: 1 }));
    mockAsync.removeItem.mockResolvedValue(undefined);
    mockAsync.clear.mockResolvedValue(undefined);

    await expect(service.saveObject('key1', { a: 1 })).resolves.toBe(true);
    await expect(service.getObject<{ a: number }>('key1')).resolves.toEqual({
      a: 1,
    });
    await expect(service.deleteObject('key1')).resolves.toBe(true);
    await expect(service.clear()).resolves.toBeUndefined();

    expect(mockAsync.setItem).toHaveBeenCalled();
    expect(mockAsync.getItem).toHaveBeenCalled();
    expect(mockAsync.removeItem).toHaveBeenCalled();
    expect(mockAsync.clear).toHaveBeenCalled();
  });

  test('invalid key handling', async () => {
    await expect(service.saveObject('', { a: 1 })).resolves.toBe(false);
    await expect(service.getObject('')).resolves.toBeUndefined();
    await expect(service.deleteObject('')).resolves.toBe(false);
  });

  test('parse error returns undefined', async () => {
    mockAsync.getItem.mockResolvedValue('not-json');
    await expect(service.getObject('key2')).resolves.toBeUndefined();
    expect(mockAsync.getItem).toHaveBeenCalled();
  });
});
