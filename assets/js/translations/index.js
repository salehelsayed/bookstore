// Import all translations
import { en } from './en.js';
import { ar } from './ar.js';

// Export translations object
export const translations = {
    en,
    ar
};

// Language configuration
export const languageConfig = {
    en: {
        dir: 'ltr',
        font: "'Noto Sans', sans-serif"
    },
    ar: {
        dir: 'rtl',
        font: "'Noto Sans Arabic', sans-serif"
    }
};

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Available languages
export const AVAILABLE_LANGUAGES = ['en', 'ar'];
