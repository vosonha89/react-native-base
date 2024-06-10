import AsyncStorage from '@react-native-async-storage/async-storage';
import { AbstractStorageService } from 'one-frontend-framework';

export class StorageService extends AbstractStorageService {
  /**
   * Save object
   * @param key 
   * @param value 
   * @returns 
   */
  public async saveObject<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      console.error('Error saving value:', e);
      return false;
    }
  }

  /**
   * Get object
   * @param key 
   * @returns 
   */
  public async getObject<T>(key: string): Promise<T | undefined> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) as T : undefined;
    } catch (e) {
      console.error('Error loading value:', e);
      return undefined;
    }
  }

  /**
   * Delete object
   * @param key 
   * @returns 
   */
  public async deleteObject(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing value:', e);
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
      console.error('Error clearing storage:', e);
    }
  }
}
