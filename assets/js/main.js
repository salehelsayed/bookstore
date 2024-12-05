console.log('main.js is loading...');

/*
 * LANGUAGE CONFIGURATION
 * ---------------------
 */
const languageConfig = {
    en: {
        dir: 'ltr',
        font: "'Noto Sans', sans-serif"
    },
    ar: {
        dir: 'rtl',
        font: "'Noto Sans Arabic', sans-serif"
    }
};

let currentTranslations = null;

/*
 * LANGUAGE HANDLING FUNCTIONS
 * --------------------------
 */

// Function to load translations for current page
async function loadTranslations(lang) {
    try {
        const pageName = window.location.pathname.split('/').pop().split('.')[0] || 'index';
        const module = await import(`./translations/${lang}.js`);
        currentTranslations = module[lang];
        return currentTranslations;
    } catch (error) {
        console.error('Error loading translations:', error);
        return null;
    }
}

// Function to apply language changes
async function applyLanguage(lang) {
    console.log('Starting language application:', lang);
    
    // Load translations first
    const translations = await loadTranslations(lang);
    if (!translations) return;

    // Set language preference
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = languageConfig[lang].dir;
    document.body.style.fontFamily = languageConfig[lang].font;

    // Update language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = lang;
    }

    // Apply translations to all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[key];
            } else if (!element.children.length || (element.children.length === 1 && element.children[0].tagName === 'I')) {
                // Only set textContent if:
                // 1. The element has no children, OR
                // 2. The element has exactly one child and it's an icon
                const iconElement = element.querySelector('i');
                if (iconElement) {
                    // Preserve the icon and update only the text
                    const iconHtml = iconElement.outerHTML;
                    element.innerHTML = iconHtml + ' ' + translations[key];
                } else {
                    element.textContent = translations[key];
                }
            } else {
                // For elements with other types of children, only update text nodes
                const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === 3);
                if (textNodes.length > 0) {
                    textNodes[0].textContent = translations[key];
                }
            }
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    
    // Initialize language switcher
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        console.log('Language selector found');
        
        // Set initial value from localStorage or default
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        languageSelect.value = currentLang;

        // Apply initial language
        applyLanguage(currentLang);

        // Add change listener
        languageSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            console.log('Language changed to:', newLang);
            applyLanguage(newLang);
        });
    } else {
        console.error('Language selector not found');
    }

    // Add image loading handlers
    const bookImages = document.querySelectorAll('.book-card img');
    bookImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'assets/images/placeholder.jpg';
        });
        
        // Add loading class
        img.classList.add('loading');
        img.addEventListener('load', function() {
            // Remove loading class once loaded
            this.classList.remove('loading');
        });
    });
});
