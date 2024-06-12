import 'reflect-metadata';
import { container } from 'tsyringe';
import { useEffect, useState } from 'react';
import { LanguageText } from '../../types/languageText';
import { LanguageService } from '../../services/logic/languageSerivce';

/**
 * For global language hook
 * @returns 
 */
function LanguageHook() {
    const languageService = container.resolve(LanguageService);
    const [text, setText] = useState(languageService.text as LanguageText);

    async function changeLanguage(language: string): Promise<void> {
        await languageService.setLanguage(language);
        setText(languageService.text);
    }

    useEffect(() => {
    }, []);

    return {
        text,
        changeLanguage
    };
}

export default LanguageHook;