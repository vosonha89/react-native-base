import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import en from '../../../assets/language/en.json';
import vi from '../../../assets/language/vi.json';
import { StorageService } from './storageService';
import { LanguageText } from '../../types/languageText';
import {
  AbstractLanguageService,
  LanguageCode,
  StorageKey,
} from 'one-frontend-framework';

@singleton()
export class LanguageService extends AbstractLanguageService<StorageService> {
  public storeService: StorageService = container.resolve(StorageService);
  public text: LanguageText = {} as LanguageText;

  public async initLanguage(): Promise<void> {
    try {
      const stored = await this.storeService.getObject<string>(
        StorageKey.language,
      );
      const currentLanguage =
        stored && (stored === LanguageCode.EN || stored === LanguageCode.VI)
          ? stored
          : LanguageCode.VI;
      this.getLanguageText(currentLanguage);
    } catch (err) {
      console.error(
        'LanguageService.initLanguage: failed to read stored language, falling back to default',
        err,
      );
      this.getLanguageText(LanguageCode.VI);
    }
  }

  /**
   * Set language to store
   * @param value
   */
  public async setLanguage(value: string): Promise<void> {
    const me = this;
    const normalized =
      value === LanguageCode.EN ? LanguageCode.EN : LanguageCode.VI;
    try {
      const saved = await me.storeService.saveObject<string>(
        StorageKey.language,
        normalized,
      );
      if (!saved) {
        console.warn(
          `LanguageService.setLanguage: storage save returned false for value=${normalized}`,
        );
      }
    } catch (err) {
      console.error(
        `LanguageService.setLanguage: failed to persist language=${normalized}`,
        err,
      );
    } finally {
      // Always update in-memory text so UI can respond immediately
      me.getLanguageText(normalized);
    }
  }

  /**
   * Get language text from json
   * @param value
   */
  public getLanguageText(value: string): void {
    const me = this;
    if (value == LanguageCode.EN) {
      me.text = en as unknown as LanguageText;
    } else {
      me.text = vi as unknown as LanguageText;
    }
  }
}
