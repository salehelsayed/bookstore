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

// Search handler function
function handleSearch(query) {
    if (query.trim()) {
        console.log('Searching for:', query);
        // TODO: Implement actual search functionality in Phase 3
    }
}
