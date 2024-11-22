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

    // Comment Section Functionality
    // Handle star rating selection
    const ratingStars = document.querySelectorAll('.rating-star');
    let selectedRating = 0;

    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                updateStars(rating, 'hover');
            });

            star.addEventListener('mouseout', function() {
                updateStars(selectedRating, 'selected');
            });

            star.addEventListener('click', function() {
                selectedRating = this.dataset.rating;
                updateStars(selectedRating, 'selected');
            });
        });
    }

    function updateStars(rating, state) {
        ratingStars.forEach(star => {
            const starRating = star.dataset.rating;
            if (state === 'hover') {
                star.classList.toggle('bi-star-fill', starRating <= rating);
                star.classList.toggle('bi-star', starRating > rating);
            } else {
                star.classList.toggle('bi-star-fill', starRating <= selectedRating);
                star.classList.toggle('bi-star', starRating > selectedRating);
            }
        });
    }

    // Handle comment form submission
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const commentText = document.getElementById('commentText').value;
            if (!commentText.trim() || selectedRating === 0) {
                alert('Please provide both a rating and a comment.');
                return;
            }

            // Here you would typically send the data to your backend
            // For now, we'll just add it to the UI
            addNewComment({
                username: 'Current User',
                rating: selectedRating,
                text: commentText,
                timestamp: 'Just now',
                likes: 0
            });

            // Reset form
            commentForm.reset();
            selectedRating = 0;
            updateStars(0, 'selected');
        });
    }

    // Function to add a new comment to the UI
    function addNewComment(comment) {
        const commentsList = document.querySelector('.comments-list');
        const newComment = document.createElement('div');
        newComment.className = 'card mb-3';
        newComment.innerHTML = `
            <div class="card-body">
                <div class="d-flex mb-3">
                    <img src="https://via.placeholder.com/40" class="rounded-circle me-3" alt="User Avatar">
                    <div>
                        <h6 class="mb-1">${comment.username}</h6>
                        <div class="d-flex align-items-center">
                            <div class="rating me-2">
                                ${generateStarRating(comment.rating)}
                            </div>
                            <small class="text-muted">${comment.timestamp}</small>
                        </div>
                    </div>
                </div>
                <p class="card-text">${comment.text}</p>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary me-2">
                        <i class="bi bi-hand-thumbs-up"></i> <span>${comment.likes}</span>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary me-2">
                        <i class="bi bi-reply"></i> <span data-translate="reply">Reply</span>
                    </button>
                </div>
            </div>
        `;
        commentsList.insertBefore(newComment, commentsList.firstChild);
        
        // Update comment count
        updateCommentCount();
    }

    // Function to generate star rating HTML
    function generateStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="bi bi-star${i <= rating ? '-fill' : ''} text-warning"></i>`;
        }
        return stars;
    }

    // Handle comment sorting
    const sortDropdown = document.getElementById('commentSort');
    if (sortDropdown) {
        sortDropdown.addEventListener('click', function(e) {
            if (e.target.classList.contains('dropdown-item')) {
                const sortType = e.target.textContent;
                // Here you would typically sort the comments based on the selected option
                // For now, we'll just update the button text
                const sortButton = document.querySelector('#commentSort span');
                sortButton.textContent = sortType;
            }
        });
    }

    // Handle like buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('bi-hand-thumbs-up') || 
            e.target.parentElement.classList.contains('bi-hand-thumbs-up')) {
            const likeButton = e.target.closest('button');
            const likeCount = likeButton.querySelector('span');
            let currentLikes = parseInt(likeCount.textContent);
            likeCount.textContent = currentLikes + 1;
            likeButton.classList.add('active');
        }
    });

    // Handle load more comments
    const loadMoreBtn = document.querySelector('[data-translate="loadMore"]');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Here you would typically load more comments from the backend
            // For now, we'll just disable the button
            this.disabled = true;
            this.textContent = 'No more comments';
        });
    }

    // Function to update comment count
    function updateCommentCount() {
        const commentsCount = document.querySelector('.comments-count span');
        if (commentsCount) {
            const count = document.querySelectorAll('.comments-list .card').length;
            commentsCount.textContent = `${count} Comments`;
        }
    }

    // Rating System
    const stars = document.querySelectorAll('.star');
    const ratingMessage = document.getElementById('rating-message');
    let userRating = 0;

    function updateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        stars.forEach((star, index) => {
            star.classList.remove('active', 'half');
            if (index < fullStars) {
                star.classList.add('active');
            } else if (index === fullStars && hasHalf) {
                star.classList.add('half');
            }
        });
    }

    function updateRatingMessage(rating) {
        const messages = {
            en: {
                0: 'Click to rate',
                0.5: 'Poor',
                1: 'Poor',
                1.5: 'Fair',
                2: 'Fair',
                2.5: 'Good',
                3: 'Good',
                3.5: 'Very Good',
                4: 'Very Good',
                4.5: 'Excellent',
                5: 'Excellent'
            },
            ar: {
                0: 'انقر للتقييم',
                0.5: 'ضعيف',
                1: 'ضعيف',
                1.5: 'مقبول',
                2: 'مقبول',
                2.5: 'جيد',
                3: 'جيد',
                3.5: 'جيد جداً',
                4: 'جيد جداً',
                4.5: 'ممتاز',
                5: 'ممتاز'
            }
        };
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        ratingMessage.textContent = messages[currentLang][rating] || messages[currentLang][0];
    }

    stars.forEach(star => {
        star.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const isLeftHalf = e.clientX - rect.left < rect.width / 2;
            const rating = parseFloat(this.dataset.rating);
            userRating = isLeftHalf ? rating - 0.5 : rating;
            updateStars(userRating);
            updateRatingMessage(userRating);
            // Here you can add code to send the rating to your backend
            console.log('User rated:', userRating);
        });

        star.addEventListener('mousemove', function(e) {
            if (!userRating) {
                const rect = this.getBoundingClientRect();
                const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                const rating = parseFloat(this.dataset.rating);
                const hoverRating = isLeftHalf ? rating - 0.5 : rating;
                updateStars(hoverRating);
                updateRatingMessage(hoverRating);
            }
        });
    });

    document.querySelector('.stars-container').addEventListener('mouseleave', () => {
        if (!userRating) {
            updateStars(0);
            updateRatingMessage(0);
        } else {
            updateStars(userRating);
            updateRatingMessage(userRating);
        }
    });

    // Language translations
    const translations = {
        en: {
            // Navigation
            brand: 'BookStore',
            home: 'Home',
            categories: 'Categories',
            about: 'About',
            contact: 'Contact',
            language: 'Language',
            signin: 'Sign In',
            register: 'Register',

            // Filters
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
            ratingHint: 'Click left side for half star, right side for full star',

            // Book Grid
            resultsCount: 'Showing 1-12 of 48 books',
            gridView: 'Grid View',
            listView: 'List View',
            downloadPdf: 'Download PDF',

            // Book Detail Page
            bookDetailTitle: 'Book Details - BookStore',
            by: 'By',
            reviewCount: '245 reviews',
            ratingCount: '1,234 ratings',
            publisher: 'Publisher',
            publisherName: 'Publisher Name',
            publicationDate: 'Publication Date',
            pages: 'Pages',
            isbn: 'ISBN',
            category: 'Category',
            description: 'Description',
            aboutAuthor: 'About the Author',
            relatedBooks: 'Related Books',
            fileSize: 'File size',

            // Sample Books
            book1Title: 'The Great Adventure',
            book1Author: 'John Smith',
            book1Description: 'An epic tale of discovery and courage that takes readers on a journey through uncharted territories.',
            book1AuthorBio: 'John Smith is an award-winning author known for his adventure novels.',

            book2Title: 'Science Today',
            book2Author: 'Sarah Johnson',
            book2Description: 'A comprehensive look at modern scientific discoveries and their impact on our world.',
            book2AuthorBio: 'Dr. Sarah Johnson is a renowned scientist and science communicator.',

            book3Title: 'The Art of Cooking',
            book3Author: 'Maria Garcia',
            book3Description: 'Master the fundamentals of cooking with this beautifully illustrated guide.',
            book3AuthorBio: 'Maria Garcia is a celebrated chef and culinary instructor.',

            // Comments Section
            comments: 'Comments',
            totalComments: '12 Comments',
            sortBy: 'Sort by',
            newest: 'Newest',
            oldest: 'Oldest',
            mostLiked: 'Most Liked',
            writeComment: 'Write a Comment',
            selectRating: 'Select your rating',
            commentPlaceholder: 'Share your thoughts about this book...',
            postComment: 'Post Comment',
            reply: 'Reply',
            loadMore: 'Load More Comments',

            // Footer
            copyright: ' 2023 BookStore. All rights reserved.'
        },
        ar: {
            // Navigation
            brand: 'المكتبة',
            home: 'الرئيسية',
            categories: 'التصنيفات',
            about: 'من نحن',
            contact: 'اتصل بنا',
            language: 'اللغة',
            signin: 'تسجيل الدخول',
            register: 'التسجيل',

            // Filters
            filters: 'التصفية',
            genre: 'النوع',
            fiction: 'روايات',
            nonfiction: 'غير روائي',
            science: 'علوم',
            allLanguages: 'كل اللغات',
            english: 'الإنجليزية',
            spanish: 'الإسبانية',
            french: 'الفرنسية',
            rating: 'التقييم',
            rating4plus: '4+ نجوم',
            rating3plus: '3+ نجوم',
            clearFilters: 'مسح التصفية',
            ratingHint: 'انقر على الجانب الأيسر لنصف نجمة، والجانب الأيمن لنجمة كاملة',

            // Book Grid
            resultsCount: 'عرض 1-12 من 48 كتاب',
            gridView: 'عرض شبكي',
            listView: 'عرض قائمة',
            downloadPdf: 'تحميل PDF',

            // Book Detail Page
            bookDetailTitle: 'تفاصيل الكتاب - المكتبة',
            by: 'تأليف',
            reviewCount: '245 مراجعة',
            ratingCount: '1,234 تقييم',
            publisher: 'الناشر',
            publisherName: 'اسم الناشر',
            publicationDate: 'تاريخ النشر',
            pages: 'الصفحات',
            isbn: 'الرقم الدولي',
            category: 'التصنيف',
            description: 'الوصف',
            aboutAuthor: 'عن المؤلف',
            relatedBooks: 'كتب مشابهة',
            fileSize: 'حجم الملف',

            // Sample Books
            book1Title: 'المغامرة العظيمة',
            book1Author: 'جون سميث',
            book1Description: 'قصة ملحمية عن الاكتشاف والشجاعة تأخذ القراء في رحلة عبر أراضٍ غير مستكشفة.',
            book1AuthorBio: 'جون سميث مؤلف حائز على جوائز معروف بروايات المغامرات.',

            book2Title: 'العلوم اليوم',
            book2Author: 'سارة جونسون',
            book2Description: 'نظرة شاملة على الاكتشافات العلمية الحديثة وتأثيرها على عالمنا.',
            book2AuthorBio: 'د. سارة جونسون عالمة مرموقة ومتحدثة في مجال العلوم.',

            book3Title: 'فن الطبخ',
            book3Author: 'ماريا غارسيا',
            book3Description: 'أتقن أساسيات الطبخ مع هذا الدليل المصور بشكل جميل.',
            book3AuthorBio: 'ماريا غارسيا طاهية مشهورة ومدربة طهي.',

            // Comments Section
            comments: 'التعليقات',
            totalComments: '12 تعليق',
            sortBy: 'ترتيب حسب',
            newest: 'الأحدث',
            oldest: 'الأقدم',
            mostLiked: 'الأكثر إعجاباً',
            writeComment: 'اكتب تعليقاً',
            selectRating: 'اختر تقييمك',
            commentPlaceholder: 'شارك رأيك حول هذا الكتاب...',
            postComment: 'نشر التعليق',
            reply: 'رد',
            loadMore: 'تحميل المزيد من التعليقات',

            // Footer
            copyright: ' 2023 المكتبة. جميع الحقوق محفوظة.'
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
});
