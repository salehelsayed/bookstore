# Star Rating System Documentation

## Overview
The BookStore project implements a flexible star rating system that supports both LTR (Left-to-Right) and RTL (Right-to-Left) languages, with support for half stars and optional numeric display.

## Implementation

### HTML Structure
Book cards should include a `data-rating` attribute and a container for the rating:

\```html
<div class="card h-100 book-card" data-rating="4">
    <div class="card-body">
        <h5 class="card-title" data-translate="bookTitle">Book Title</h5>
        <p class="card-text text-muted" data-translate="authorName">Author Name</p>
        <div class="rating-container">
            <!-- Rating will be inserted by JavaScript -->
        </div>
        <button class="btn btn-primary w-100" data-translate="downloadPdf">
            <i class="bi bi-download"></i> Download PDF
        </button>
    </div>
</div>
\```

### JavaScript Usage

#### Basic Usage
The `createStarRating()` function creates star ratings with various options:

\```javascript
// Basic usage (5 stars with number)
const rating = createStarRating(4.5);

// Without number display
const justStars = createStarRating(4.5, false);

// Custom number of stars
const tenStars = createStarRating(8, true, 10);
\```

#### Function Parameters
- `rating` (number): Rating value (e.g., 4.5)
- `showNumber` (boolean, optional): Whether to show the number next to stars (default: true)
- `maxStars` (number, optional): Maximum number of stars to display (default: 5)

#### Automatic Updates
The system automatically updates ratings in these scenarios:
- Page load
- Language change
- Manual call to `updateBookCardRatings()`

### Dynamic Card Creation
Example of adding a new book card with rating:

\```javascript
function addBookCard(title, author, rating) {
    const bookCard = document.createElement('div');
    bookCard.className = 'col-xl-3 col-lg-4 col-md-6';
    bookCard.innerHTML = `
        <div class="card h-100 book-card" data-rating="${rating}">
            <img src="./assets/images/placeholder.jpg" class="card-img-top" alt="Book Cover">
            <div class="card-body">
                <h5 class="card-title" data-translate="bookTitle">${title}</h5>
                <p class="card-text text-muted" data-translate="authorName">${author}</p>
                <div class="rating-container"></div>
                <button class="btn btn-primary w-100" data-translate="downloadPdf">
                    <i class="bi bi-download"></i> Download PDF
                </button>
            </div>
        </div>
    `;
    document.getElementById('books-grid').appendChild(bookCard);
    updateBookCardRatings();
}
\```

### Updating Ratings
To update a rating dynamically:

\```javascript
const bookCard = document.querySelector('.book-card');
bookCard.dataset.rating = "4.5";
updateBookCardRatings();
\```

## Features
- Supports half-star ratings
- RTL/LTR language support
- Automatic translation integration
- Configurable maximum stars
- Optional numeric display
- Consistent styling across the application
- Bootstrap Icons integration

## CSS Classes
- `.rating-container`: Main container for rating component
- `.rating`: Container for star icons
- `.rating-text`: Container for numeric rating display
- `.rating-number`: Numeric rating value
- `.rating-time`: Time indicator (e.g., "days ago")

## Dependencies
- Bootstrap Icons (bi-star, bi-star-fill, bi-star-half)
- Bootstrap CSS framework
- Main translation system

## RTL Support
The rating system automatically handles RTL languages by:
- Maintaining LTR direction for star display
- Reversing container elements for RTL languages
- Properly aligning text and numbers in RTL mode
- Using logical CSS properties for RTL/LTR support