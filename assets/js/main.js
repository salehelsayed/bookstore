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
        // Load main translations first
        const mainModule = await import(`./translations/${language}.js`)
            .catch(error => {
                console.error('Failed to load main translations:', error);
                throw new Error('Main translations are required');
            });
        translations = { ...mainModule[language] };

        // Load core translations if available
        try {
            const coreModule = await import(`./translations/core/${language}.js`);
            translations = { ...translations, ...coreModule[language] };
        } catch (error) {
            console.warn('Failed to load core translations:', error);
        }

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

// Function to create star rating HTML
function createStarRating(rating, showNumber = true, maxStars = 5) {
    // Round to nearest half
    const roundedRating = Math.round(rating * 2) / 2;
    
    const container = document.createElement('div');
    container.className = 'rating-container';
    
    // Create stars container
    const starsContainer = document.createElement('div');
    starsContainer.className = 'rating';
    
    // Add stars
    for (let i = 1; i <= maxStars; i++) {
        const star = document.createElement('i');
        if (i <= roundedRating) {
            star.className = 'bi bi-star-fill text-warning';
        } else if (i - 0.5 === roundedRating) {
            star.className = 'bi bi-star-half text-warning';
        } else {
            star.className = 'bi bi-star text-warning';
        }
        starsContainer.appendChild(star);
    }
    
    container.appendChild(starsContainer);
    
    // Add rating count
    if (showNumber) {
        const ratingText = document.createElement('div');
        ratingText.className = 'rating-text';
        
        const ratingCount = document.createElement('span');
        ratingCount.className = 'rating-count';
        ratingCount.setAttribute('data-translate', 'ratingCount');
        
        const ratingLabel = document.createElement('span');
        ratingLabel.className = 'rating-label';
        ratingLabel.setAttribute('data-translate', 'ratings');
        
        ratingText.appendChild(ratingCount);
        ratingText.appendChild(document.createTextNode(' '));
        ratingText.appendChild(ratingLabel);
        
        container.appendChild(ratingText);
    }
    
    return container;
}

// Function to create filter ratings
function createFilterRatings() {
    const ratingFilter = document.querySelector('.rating-filter');
    if (!ratingFilter) return;

    // Clear existing content
    ratingFilter.innerHTML = '';

    // Create 4+ stars rating
    const rating4Div = document.createElement('div');
    rating4Div.className = 'form-check';
    
    const input4 = document.createElement('input');
    input4.className = 'form-check-input';
    input4.type = 'radio';
    input4.name = 'rating';
    input4.id = 'rating4';
    
    const label4 = document.createElement('label');
    label4.className = 'form-check-label';
    label4.htmlFor = 'rating4';
    
    const stars4 = createStarRating(4, false);
    const text4 = document.createElement('span');
    text4.setAttribute('data-translate', 'fourPlus');
    
    rating4Div.appendChild(input4);
    label4.appendChild(stars4);
    label4.appendChild(text4);
    rating4Div.appendChild(label4);

    // Create 3+ stars rating
    const rating3Div = document.createElement('div');
    rating3Div.className = 'form-check';
    
    const input3 = document.createElement('input');
    input3.className = 'form-check-input';
    input3.type = 'radio';
    input3.name = 'rating';
    input3.id = 'rating3';
    
    const label3 = document.createElement('label');
    label3.className = 'form-check-label';
    label3.htmlFor = 'rating3';
    
    const stars3 = createStarRating(3, false);
    const text3 = document.createElement('span');
    text3.setAttribute('data-translate', 'threePlus');
    
    rating3Div.appendChild(input3);
    label3.appendChild(stars3);
    label3.appendChild(text3);
    rating3Div.appendChild(label3);

    // Add to filter container
    ratingFilter.appendChild(rating4Div);
    ratingFilter.appendChild(rating3Div);
}

// Update this function to handle translations
function updateBookCardRatings() {
    document.querySelectorAll('.book-card').forEach(card => {
        const rating = parseFloat(card.dataset.rating) || 4; // Default to 4 if not set
        const ratingContainer = card.querySelector('.rating-container');
        if (ratingContainer) {
            const newRating = createStarRating(rating);
            ratingContainer.replaceWith(newRating);
        }
    });
    // Update translations after replacing ratings
    applyTranslations();
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

    // Initialize ratings
    createFilterRatings();
    updateBookCardRatings();
    
    // Update ratings when language changes
    window.addEventListener('languageChanged', () => {
        createFilterRatings();
        updateBookCardRatings();
    });

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
