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

let currentLanguage = 'en';
let translations = {};

/*
 * TRANSLATION HANDLING FUNCTIONS
 * -----------------------------
 */

// Function to load translations for current page
async function loadTranslations(language) {
    try {
        // Load core translations first
        const coreModule = await import(`./translations/core/${language}.js`)
            .catch(error => {
                console.error('Failed to load core translations:', error);
                throw new Error('Core translations are required');
            });
        translations = { ...coreModule[language] };

        // Load category translations if on category page
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            try {
                const categoryModule = await import(`./translations/categories/${language}.js`);
                translations = { ...translations, ...categoryModule.categories };
            } catch (error) {
                console.warn('Failed to load category translations:', error);
            }
        }

        // Load specific book translations if on book detail page
        if (window.location.pathname.includes('book-detail.html')) {
            const bookId = getBookIdFromUrl();
            try {
                const bookModule = await import(`./translations/books/${language}/book${bookId}.js`);
                translations = { ...translations, ...bookModule.book1 };
            } catch (error) {
                console.warn(`Failed to load translations for book ${bookId}:`, error);
            }
        }

        // Apply translations to the page
        applyTranslations();
        
        // Update HTML dir attribute for RTL support
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        
        // Store the current language preference
        localStorage.setItem('language', language);
        currentLanguage = language;
        
    } catch (error) {
        console.error('Critical error loading translations:', error);
        // Fallback to English if available and not already trying to load English
        if (language !== 'en') {
            console.log('Attempting to fallback to English...');
            return loadTranslations('en');
        }
        // If we're already trying English and it failed, show an error to the user
        alert('Error loading translations. Please try refreshing the page.');
    }
}

// Function to get book ID from URL
function getBookIdFromUrl() {
    // Implement based on your URL structure
    // For example: /book-detail.html?id=1
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// Apply translations to the page
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[key];
            } else if (!element.children.length || (element.children.length === 1 && element.children[0].tagName === 'I')) {
                // Handle elements with no children or just an icon
                const iconElement = element.querySelector('i');
                if (iconElement) {
                    // Preserve the icon and update text with proper spacing
                    const iconHtml = iconElement.outerHTML;
                    const isRTL = document.documentElement.dir === 'rtl';
                    if (isRTL) {
                        // For RTL, put text first then icon with proper spacing
                        element.innerHTML = translations[key] + '&nbsp;' + iconHtml;
                    } else {
                        // For LTR, put icon first then text with proper spacing
                        element.innerHTML = iconHtml + '&nbsp;' + translations[key];
                    }
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
        } else {
            console.warn(`Translation key not found: ${key}`);
        }
    });
}

// Language switcher
async function changeLanguage(language) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    
    try {
        await loadTranslations(language);
        // Dispatch event for other components that might need to know about language change
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    } catch (error) {
        console.error('Failed to change language:', error);
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

// Initialize translations
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');
    
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        console.log('Language selector found');
        
        // Set initial value from localStorage or default
        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSelect.value = savedLanguage;

        try {
            // Apply initial language
            await loadTranslations(savedLanguage);
            
            // Add change listener
            languageSelect.addEventListener('change', (e) => {
                const newLang = e.target.value;
                console.log('Language changed to:', newLang);
                changeLanguage(newLang);
            });
        } catch (error) {
            console.error('Failed to initialize translations:', error);
            // Show error message to user
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.textContent = 'Failed to load translations. Please refresh the page.';
            document.body.insertBefore(errorMessage, document.body.firstChild);
        }
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
