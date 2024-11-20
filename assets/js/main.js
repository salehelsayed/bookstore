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
        page1: '1',
        page2: '2',
        page3: '3',
        copyright: ' 2024 BookStore. All rights reserved.',
        searchInput: 'Search for books...'
    },
    ar: {
        brand: 'المكتبة',
        home: 'الرئيسية',
        categories: 'التصنيفات',
        about: 'من نحن',
        contact: 'اتصل بنا',
        language: 'اللغة',
        signin: 'تسجيل الدخول',
        register: 'حساب جديد',
        filters: 'التصفية',
        genre: 'التصنيف',
        fiction: 'روايات',
        nonfiction: 'كتب غير روائية',
        science: 'علوم',
        allLanguages: 'جميع اللغات',
        english: 'الإنجليزية',
        spanish: 'الإسبانية',
        french: 'الفرنسية',
        rating: 'التقييم',
        rating4plus: '٤+ نجوم',
        rating3plus: '٣+ نجوم',
        clearFilters: 'مسح التصفية',
        resultsCount: 'عرض ١-١٢ من ٤٨ كتاب',
        gridView: 'عرض شبكي',
        listView: 'عرض قائمة',
        bookTitle: 'عنوان الكتاب',
        authorName: 'اسم المؤلف',
        downloadPdf: 'تحميل PDF',
        previous: 'السابق',
        next: 'التالي',
        page1: '١',
        page2: '٢',
        page3: '٣',
        copyright: '© ٢٠٢٤ المكتبة. جميع الحقوق محفوظة',
        searchInput: 'ابحث عن الكتب...'
    }
};

// Initialize language
let currentLanguage = localStorage.getItem('language') || 'en';
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

// Function to set language and update UI
function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', lang);
    
    // Update language checks
    document.querySelectorAll('.language-check').forEach(check => {
        check.style.visibility = 'hidden';
    });
    const activeCheck = document.querySelector(`.language-check.${lang}`);
    if (activeCheck) {
        activeCheck.style.visibility = 'visible';
    }

    // Update search input placeholder
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.placeholder = translations[currentLanguage].searchInput;
    }

    translatePage();
}

// Function to translate the page
function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[currentLanguage][key]) {
            if (element.placeholder !== undefined) {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

// Initialize translations
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);

    // Language selector event listeners
    document.querySelectorAll('[data-language]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(element.dataset.language);
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
