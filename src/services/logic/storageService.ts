import AsyncStorage from '@react-native-async-storage/async-storage';
import { AbstractStorageService } from 'one-frontend-framework';

/**
 * Lightweight retry helper for transient storage errors.
 * Retries the provided async function up to `retries` times.
 */
async function retry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i === retries) break;
      // small backoff could be added here if desired
    }
  }
  throw lastError;
}

export class StorageService extends AbstractStorageService {
  /**
   * Save object
   * @param key 
   * @param value 
   * @returns 
   */
  public async saveObject<T>(key: string, value: T): Promise<boolean> {
    if (!key) {
      console.error('StorageService.saveObject: invalid key');
      return false;
    }
    try {
      const jsonValue = JSON.stringify(value);
      await retry(() => AsyncStorage.setItem(key, jsonValue));
      return true;
    } catch (e) {
      console.error(`StorageService.saveObject: Error saving value for key=${key}`, e);
      return false;
    }
  }

  /**
   * Get object
   * @param key 
   * @returns 
   */
  public async getObject<T>(key: string): Promise<T | undefined> {
    if (!key) {
      console.error('StorageService.getObject: invalid key');
      return undefined;
    }
    try {
      const jsonValue = await retry(() => AsyncStorage.getItem(key));
      if (jsonValue == null) return undefined;
      try {
        return JSON.parse(jsonValue) as T;
      } catch (parseError) {
        console.error(`StorageService.getObject: Failed to parse JSON for key=${key}`, parseError);
        return undefined;
      }
    } catch (e) {
      console.error(`StorageService.getObject: Error loading value for key=${key}`, e);
      return undefined;
    }
  }

  /**
   * Delete object
   * @param key 
   * @returns 
   */
  public async deleteObject(key: string): Promise<boolean> {
    if (!key) {
      console.error('StorageService.deleteObject: invalid key');
      return false;
    }
    try {
      await retry(() => AsyncStorage.removeItem(key));
      return true;
    } catch (e) {
      console.error(`StorageService.deleteObject: Error removing value for key=${key}`, e);
      return false;
    }
  }

  /**
   * Clear object
   */
  public async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('StorageService.clear: Error clearing storage', e);
    }
  }
}
