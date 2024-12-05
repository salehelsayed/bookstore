```markdown
# BookStore Translation Guide

## Overview
This document explains how the translation system works in the BookStore project and provides guidelines for adding new content or making changes to existing translations.

## Translation System Architecture

```mermaid
graph TD
    A[HTML Elements] -->|data-translate attribute| B[Translation System]
    B --> C[Language Files]
    C --> D[en.js]
    C --> E[ar.js]
    F[main.js] -->|loadTranslations()| B
    F -->|changeLanguage()| B
    B -->|Updates UI| A
```

## Key Components

### 1. HTML Structure
- All translatable elements use the `data-translate` attribute
- Example:
```html
<h1 data-translate="bookTitle">Book Title</h1>
<p data-translate="authorName">Author Name</p>
```

### 2. Translation Files
Located in `assets/js/translations/`:
- `en.js`: English translations
- `ar.js`: Arabic translations

Structure:
```javascript
const translations = {
    bookTitle: "Book Title",
    authorName: "Author Name",
    // ... other translations
}
```

### 3. Main JavaScript (main.js)
Handles:
- Language switching
- Translation loading
- DOM updates

## How to Add New Translations

### 1. HTML Elements
1. Add `data-translate` attribute to the element:
```html
<button data-translate="newButton">New Button</button>
```

### 2. Add Translation Keys
1. Open `assets/js/translations/en.js`
2. Add new English translation:
```javascript
{
    // ... existing translations
    newButton: "New Button"
}
```

3. Open `assets/js/translations/ar.js`
4. Add Arabic translation:
```javascript
{
    // ... existing translations
    newButton: "زر جديد"
}
```

## Translation Categories

### Current Categories:
1. **Navigation**
   - Brand name
   - Menu items
   - Search placeholder

2. **Book Information**
   - Titles
   - Author names
   - Descriptions
   - Categories

3. **UI Elements**
   - Buttons
   - Labels
   - Filters
   - Sorting options

4. **Comments Section**
   - Comment headers
   - User names
   - Time indicators
   - Action buttons

## Best Practices

1. **Consistency**
   - Use the same translation key format throughout the project
   - Keep keys descriptive and meaningful
   - Group related translations together

2. **HTML Structure**
   - Always include default text in English
   - Maintain proper nesting of translatable elements
   - Use appropriate HTML tags for different text types

3. **RTL Support**
   - Use `dir="rtl"` for Arabic text
   - Consider text alignment and spacing
   - Test layout in both LTR and RTL modes

4. **Maintenance**
   - Keep translation files organized
   - Document new additions
   - Regularly test both language versions

## Adding New Books

When adding new books to the system:

1. **Book Information**
   - Add translation keys for:
     ```javascript
     {
         bookTitle_[ID]: "Book Title",
         bookAuthor_[ID]: "Author Name",
         bookDescription_[ID]: "Book Description",
         // ... other book-specific translations
     }
     ```

2. **Categories and Tags**
   - Add new category translations if needed
   - Ensure consistent category naming across languages

3. **Testing**
   - Verify all book information displays correctly in both languages
   - Check RTL layout for Arabic text
   - Test search functionality with new content

## Common Issues and Solutions

1. **Missing Translations**
   - Check both language files for matching keys
   - Verify `data-translate` attributes
   - Check console for translation errors

2. **RTL Layout Issues**
   - Use CSS `dir` attribute classes
   - Check text alignment and margins
   - Verify Bootstrap RTL classes

3. **Dynamic Content**
   - Use translation function for dynamically added content
   - Maintain consistent key naming for dynamic elements

## Need Help?

For questions or issues:
1. Check existing translation files for examples
2. Review HTML structure in similar components
3. Test changes in both languages
4. Document any new patterns or solutions
```