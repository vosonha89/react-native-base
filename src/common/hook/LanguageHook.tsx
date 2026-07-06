import 'reflect-metadata';
import { container } from 'tsyringe';
import { useEffect, useState } from 'react';
import { LanguageText } from '../../types/languageText';
import { LanguageService } from '../../services/logic/languageSerivce';
import { appEventEmitter } from '../utils/appEventEmitter';

/**
 * Global language hook for reactive language switching.
 * Provides current language text and a changeLanguage function.
 * @returns the current language text, change function, and service instance.
 */
export function LanguageHook() {
  const languageService = container.resolve(LanguageService);
  const [text, setText] = useState(languageService.text as LanguageText);

  /**
   * Change the active language.
   * @param language - language code to switch to.
   */
  async function changeLanguage(language: string): Promise<void> {
    appEventEmitter.emit('languageChanged', language);
  }

  useEffect(() => {
    async function onLanguageChanged(e: string): Promise<void> {
      const value = e;
      await languageService.setLanguage(value);
      const languageText = languageService.text;
      setText(languageText);
    }
    appEventEmitter.on('languageChanged', onLanguageChanged);
    return () => {
      appEventEmitter.off('languageChanged', onLanguageChanged);
    };
  }, [languageService]);

  return {
    text,
    changeLanguage,
    languageService,
  };
}

export default LanguageHook;
