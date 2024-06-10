import 'reflect-metadata';
import { container } from 'tsyringe';
import { useEffect, useState } from 'react';
import { LanguageText } from '../../types/languageText';
import { LanguageService } from '../../services/logic/languageSerivce';

/**
 * For global hook
 * @returns 
 */
function languageHook() {
    const languageService = container.resolve(LanguageService);
    const [text, setText] = useState(languageService.text as LanguageText);

    function changeLanguage(): void {
        setText(text);
    }

    useEffect(() => {

    }, []);

    return {
        text,
        changeLanguage
    };
}

export default languageHook;