// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Add active class to current navigation item
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-link');
    menuItems.forEach(item => {
        if (item.href === currentLocation) {
            item.classList.add('active');
        }
    });

    // Grid/List View Toggle
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const booksGrid = document.getElementById('books-grid');

    if (gridViewBtn && listViewBtn && booksGrid) {
        gridViewBtn.addEventListener('click', () => {
            booksGrid.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', () => {
            booksGrid.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }

    // Clear Filters
    const clearFiltersBtn = document.querySelector('.btn-outline-secondary');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            // Clear checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });

            // Clear radio buttons
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });

            // Reset select elements
            document.querySelectorAll('select').forEach(select => {
                select.selectedIndex = 0;
            });
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');

    if (searchInput && searchButton) {
        // Handle search button click
        searchButton.addEventListener('click', () => {
            handleSearch(searchInput.value);
        });

        // Handle enter key in search input
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch(searchInput.value);
            }
        });
    }
});

// Language translations
const translations = {
    en: {
        brand: 'BookStore',
        home: 'Home',
        categories: 'Categories',
        about: 'About',
        contact: 'Contact',
        language: 'Language',
        signin: 'Sign In',
        register: 'Register',
        filters: 'Filters',
        genre: 'Genre',
        fiction: 'Fiction',
        nonfiction: 'Non-Fiction',
        science: 'Science',
        allLanguages: 'All Languages',
        english: 'English',
        spanish: 'Spanish',
        french: 'French',
        rating: 'Rating',
        rating4plus: '4+ Stars',
        rating3plus: '3+ Stars',
        clearFilters: 'Clear Filters',
        resultsCount: 'Showing 1-12 of 48 books',
        gridView: 'Grid View',
        listView: 'List View',
        bookTitle: 'Book Title',
        authorName: 'Author Name',
        downloadPdf: 'Download PDF',
        previous: 'Previous',
        next: 'Next',
        copyright: ' 2024 BookStore. All rights reserved.'
    },
    ar: {
        brand: '',
        home: '',
        categories: '',
        about: '',
        contact: '',
        language: '',
        signin: '',
        register: '',
        filters: '',
        genre: '',
        fiction: '',
        nonfiction: '',
        science: '',
        allLanguages: '',
        english: '',
        spanish: '',
        french: '',
        rating: '',
        rating4plus: '4+ ',
        rating3plus: '3+ ',
        clearFilters: '',
        resultsCount: '1-12 48 ',
        gridView: '',
        listView: '',
        bookTitle: '',
        authorName: '',
        downloadPdf: 'PDF',
        previous: '',
        next: '',
        copyright: ' 2024 .'
    }
};

// Initialize language
let currentLanguage = localStorage.getItem('language') || 'en';
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

// Function to update active language in dropdown
function updateLanguageUI() {
    document.querySelectorAll('[data-language]').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.language === currentLanguage) {
            el.classList.add('active');
        }
    });
}

// Function to translate the page
function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

// Initialize translations
document.addEventListener('DOMContentLoaded', () => {
    translatePage();
    updateLanguageUI();

    // Language selector event listeners
    document.querySelectorAll('[data-language]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            currentLanguage = element.dataset.language;
            document.documentElement.lang = currentLanguage;
            document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
            localStorage.setItem('language', currentLanguage);
            translatePage();
            updateLanguageUI();
        });
    });
});

// Search handler function
function handleSearch(query) {
    if (query.trim()) {
        console.log('Searching for:', query);
        // TODO: Implement actual search functionality in Phase 3
    }
}
