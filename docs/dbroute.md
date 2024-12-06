from flask import Flask, render_template, request, send_from_directory
import sqlite3, os

app = Flask(__name__)

def get_db_connection():
    # Connect to the local SQLite database file
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    # Retrieve filter parameters from the URL (e.g. /?category=Fiction&language=English&rating=4)
    category_filter = request.args.get('category')
    language_filter = request.args.get('language')
    rating_filter = request.args.get('rating')
    search_term = request.args.get('search')

    query = "SELECT * FROM books WHERE 1=1"
    params = []

    # Apply category filter if provided
    if category_filter and category_filter.lower() != "all":
        query += " AND category = ?"
        params.append(category_filter)

    # Apply language filter if provided
    if language_filter and language_filter.lower() != "all":
        query += " AND language = ?"
        params.append(language_filter)

    # Apply rating filter if provided (e.g., rating=4 means rating >=4.0)
    if rating_filter:
        query += " AND rating >= ?"
        params.append(float(rating_filter))

    # Apply search filter if provided
    if search_term:
        query += " AND (title LIKE ? OR author LIKE ? OR description LIKE ?)"
        like_pattern = f"%{search_term}%"
        params.extend([like_pattern, like_pattern, like_pattern])

    # Implement simple pagination (optional)
    per_page = 12
    page = int(request.args.get('page', 1))
    offset = (page - 1) * per_page
    query += f" LIMIT {per_page} OFFSET {offset}"

    conn = get_db_connection()
    books = conn.execute(query, params).fetchall()
    conn.close()

    # Render the index template with the filtered/paginated books
    return render_template('index.html', books=books, current_page=page)

@app.route('/book/<int:book_id>')
def book_detail(book_id):
    conn = get_db_connection()
    book = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
    conn.close()

    if book is None:
        return "Book not found", 404

    return render_template('book_detail.html', book=book)

@app.route('/download/<int:book_id>')
def download(book_id):
    conn = get_db_connection()
    book = conn.execute("SELECT file_path FROM books WHERE id = ?", (book_id,)).fetchone()
    conn.close()

    if book is None:
        return "Book not found", 404

    file_path = book['file_path']
    # file_path might look like "./storage/books/Cybersecurity/CyberBook.pdf"
    # or "C:\\path\\to\\project\\storage\\books\\Cybersecurity\\CyberBook.pdf"
    # Normalize the path to ensure compatibility:
    file_path = os.path.normpath(file_path)  # Converts to a proper Windows path if needed

    directory = os.path.dirname(file_path)
    filename = os.path.basename(file_path)
    return send_from_directory(directory, filename, as_attachment=True)
