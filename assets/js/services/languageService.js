import { translations, languageConfig, DEFAULT_LANGUAGE, AVAILABLE_LANGUAGES } from '../translations/index.js';

class LanguageService {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || DEFAULT_LANGUAGE;
        this.init();
    }

    init() {
        this.applyLanguage(this.currentLanguage);
        this.setupLanguageObserver();
    }

    // Get stored language preference
    getStoredLanguage() {
        return localStorage.getItem('language');
    }

    // Store language preference
    storeLanguage(lang) {
        localStorage.setItem('language', lang);
    }

    // Get translation for a key
    translate(key) {
        const translation = translations[this.currentLanguage]?.[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
            return translations[DEFAULT_LANGUAGE]?.[key] || key;
        }
        return translation;
    }

    // Switch language
    switchLanguage(lang) {
        if (!AVAILABLE_LANGUAGES.includes(lang)) {
            console.error(`Invalid language: ${lang}`);
            return;
        }

        this.currentLanguage = lang;
        this.storeLanguage(lang);
        this.applyLanguage(lang);
    }

    // Apply language changes to the document
    applyLanguage(lang) {
        document.documentElement.dir = languageConfig[lang].dir;
        document.documentElement.lang = lang;
        document.body.style.fontFamily = languageConfig[lang].font;
        
        this.updateAllTranslations();
        this.updateDynamicContent();
        
        // Dispatch event for other components to react
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    // Update all static translations in the document
    updateAllTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = this.translate(key);
        });
    }

    // Update dynamic content (e.g., book details, prices)
    updateDynamicContent() {
        // Update numbers to the correct format
        document.querySelectorAll('[data-number]').forEach(element => {
            const number = element.getAttribute('data-number');
            element.textContent = this.formatNumber(number);
        });

        // Update dates to the correct format
        document.querySelectorAll('[data-date]').forEach(element => {
            const date = element.getAttribute('data-date');
            element.textContent = this.formatDate(date);
        });
    }

    // Format numbers according to the current language
    formatNumber(number) {
        return new Intl.NumberFormat(this.currentLanguage).format(number);
    }

    // Format dates according to the current language
    formatDate(date) {
        return new Intl.DateTimeFormat(this.currentLanguage).format(new Date(date));
    }

    // Setup MutationObserver to handle dynamically added content
    setupLanguageObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            this.translateNode(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Translate a specific node and its children
    translateNode(node) {
        if (node.hasAttribute('data-translate')) {
            const key = node.getAttribute('data-translate');
            node.textContent = this.translate(key);
        }

        node.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = this.translate(key);
        });
    }
}

// Create and export a singleton instance
export const languageService = new LanguageService();
