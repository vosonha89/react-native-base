import 'reflect-metadata';
import { container } from 'tsyringe';
import { useEffect, useState } from 'react';
import { LanguageText } from '../../types/languageText';
import { LanguageService } from '../../services/logic/languageSerivce';
import { NativeAppEventEmitter } from 'react-native';

/**
 * For global language hook
 * @returns 
 */
function LanguageHook() {
    const languageService = container.resolve(LanguageService);
    const [text, setText] = useState(languageService.text as LanguageText);

    async function changeLanguage(language: string): Promise<void> {
        NativeAppEventEmitter.emit('languageChanged', language);
    }

    useEffect(() => {
        async function onLanguageChanged(e: string): Promise<void> {
            const value = e;
            await languageService.setLanguage(value);
            const languageText = languageService.text;
            setText(languageText);
        }
        const languageEmitter = NativeAppEventEmitter.addListener('languageChanged', onLanguageChanged);
        return () => {
            languageEmitter?.remove();
        };
    }, [languageService]);

    return {
        text,
        changeLanguage,
        languageService
    };
}

export default LanguageHook;