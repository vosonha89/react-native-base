import 'reflect-metadata';
import { container, singleton } from 'tsyringe';
import en from '../../../assets/language/en.json';
import vi from '../../../assets/language/vi.json';
import { StorageService } from './storageService';
import { LanguageText } from '../../types/languageText';
import { AbstractLanguageService, LanguageCode, StorageKey } from 'one-frontend-framework';

@singleton()
export class LanguageService extends AbstractLanguageService<StorageService> {
    public storeService: StorageService = container.resolve(StorageService);
    public text: LanguageText = {} as LanguageText;

    public async initLanguage(): Promise<void> {
        let currentLanguage = await this.storeService.getObject<string>(StorageKey.language);
        if (!currentLanguage) {
            currentLanguage = LanguageCode.VI;
        }
        this.getLanguageText(currentLanguage);
    }

    /**
     * Set language to store
     * @param value 
     */
    public async setLanguage(value: string): Promise<void> {
        const me = this;
        await me.storeService.saveObject<string>(StorageKey.language, value);
        me.getLanguageText(value);
    }

    /**
     * Get language text from json
     * @param value 
     */
    public getLanguageText(value: string): void {
        const me = this;
        if (value == LanguageCode.EN) {
            me.text = en as unknown as LanguageText;
        }
        else {
            me.text = vi as unknown as LanguageText;
        }
    }
}