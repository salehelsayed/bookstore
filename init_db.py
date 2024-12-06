import sqlite3
import csv
import os

def clean_string(s):
    if s is None:
        return ''
    # Remove BOM and other special characters
    return s.strip().strip('\ufeff').strip('�').strip('"')

def fix_path(path):
    if not path:
        return ''
    # Convert path separators
    path = path.replace('\\', '/')
    # Remove ./ prefix if exists
    if path.startswith('./'):
        path = path[2:]
    return path

def init_db():
    # Connect to database
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Drop existing table to start fresh
    cursor.execute('DROP TABLE IF EXISTS books')

    # Create books table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT,
        category TEXT,
        language TEXT,
        rating REAL,
        reviews_count INTEGER DEFAULT 0,
        file_path TEXT,
        image_path TEXT
    )
    ''')

    # Sample book data
    books = [
        {
            'title': 'Intro to Cybersecurity',
            'author': 'Ministry Of DG',
            'description': 'An introduction to cybersecurity principles',
            'category': 'Cybersecurity',
            'language': 'English',
            'rating': 4.5,
            'reviews_count': 1234,
            'file_path': 'books/Cybersecurity/Cybersecurity-Handbook-English-version.pdf',
            'image_path': 'books/Cybersecurity/book_cover.png'
        },
        {
            'title': 'Advanced Language Studies',
            'author': 'Gamal Hassanen',
            'description': 'Meanings in Arabic Language',
            'category': 'Language',
            'language': 'Arabic',
            'rating': 4.0,
            'reviews_count': 567,
            'file_path': 'books/Language/Arabic-Language-Studies.pdf',
            'image_path': 'books/Language/book_cover.png'
        },
        {
            'title': 'Python Programming',
            'author': 'John Smith',
            'description': 'A comprehensive guide to Python programming',
            'category': 'Programming',
            'language': 'English',
            'rating': 4.8,
            'reviews_count': 2345,
            'file_path': 'books/Programming/Python-Guide.pdf',
            'image_path': 'books/Programming/book_cover.png'
        }
    ]

    # Insert sample books
    for book in books:
        cursor.execute('''
        INSERT INTO books (title, author, description, category, language, rating, reviews_count, file_path, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            book['title'],
            book['author'],
            book['description'],
            book['category'],
            book['language'],
            book['rating'],
            book['reviews_count'],
            book['file_path'],
            book['image_path']
        ))

    # Check if table is empty
    cursor.execute('SELECT COUNT(*) FROM books')
    if cursor.fetchone()[0] == 0:
        # Read CSV file and insert data
        with open('books_data.csv', 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                cursor.execute('''
                INSERT INTO books (title, author, description, category, language, rating, reviews_count, file_path, image_path)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    clean_string(row['title']),
                    clean_string(row['author']),
                    clean_string(row.get('description', '')),
                    clean_string(row.get('category', '')),
                    clean_string(row.get('language', 'English')),
                    float(row.get('rating', 0)),
                    int(row.get('reviews_count', 0)),
                    fix_path(row.get('file_path', '')),
                    fix_path(row.get('image_path', ''))
                ))

    # Commit changes and close connection
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully!")
