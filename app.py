from flask import Flask, send_from_directory, abort, request, render_template, url_for
import os
import sqlite3
import math

# Initialize Flask with explicit template and static folders
app = Flask(__name__, 
           template_folder='templates')

# Add min function to Jinja2 environment
app.jinja_env.globals.update(min=min)

# Configure static files to be served from assets directory
app.static_folder = 'assets'
app.static_url_path = '/assets'

# Add storage path for uploaded files
app.add_url_rule('/storage/<path:filename>',
                 endpoint='storage',
                 view_func=lambda filename: send_from_directory('storage', filename))

def get_db_connection():
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def process_book_data(book):
    """Process book data to ensure proper image paths"""
    if isinstance(book, sqlite3.Row):
        book = dict(book)
    
    # Check if book cover exists
    if book.get('image_path'):
        # Convert Windows path to URL path
        image_path = book['image_path'].replace('\\', '/')
        # Remove leading ./ if present
        if image_path.startswith('./'):
            image_path = image_path[2:]
        
        # Check if the image file exists in the storage directory
        full_path = os.path.join(app.root_path, 'storage', image_path)
        if os.path.isfile(full_path):
            # If file exists, use it with storage prefix
            book['image_path'] = url_for('storage', filename=image_path)
        else:
            # If file doesn't exist, use placeholder
            book['image_path'] = url_for('static', filename='images/placeholder.jpg')
    else:
        # If no image path specified, use placeholder
        book['image_path'] = url_for('static', filename='images/placeholder.jpg')
    
    return book

@app.route('/')
def home():
    try:
        # Get filter parameters
        category_filter = request.args.get('category')
        language_filter = request.args.get('language')
        rating_filter = request.args.get('rating')
        search_term = request.args.get('search')

        # Build base query
        base_query = "SELECT * FROM books WHERE 1=1"
        params = []

        if category_filter and category_filter.lower() != "all":
            base_query += " AND category = ?"
            params.append(category_filter)

        if language_filter and language_filter.lower() != "all":
            base_query += " AND language = ?"
            params.append(language_filter)

        if rating_filter:
            base_query += " AND rating >= ?"
            params.append(float(rating_filter))

        if search_term:
            base_query += " AND (title LIKE ? OR author LIKE ? OR description LIKE ?)"
            like_pattern = f"%{search_term}%"
            params.extend([like_pattern, like_pattern, like_pattern])

        # Get total count for pagination
        count_query = f"SELECT COUNT(*) as total FROM ({base_query})"
        
        # Debug print
        print(f"Query: {base_query}")
        print(f"Parameters: {params}")
        
        conn = get_db_connection()
        
        # Debug print
        print("Executing count query...")
        total_books = conn.execute(count_query, params).fetchone()['total']
        print(f"Total books found: {total_books}")

        # Add pagination - limit to 10 books per page
        per_page = 10
        total_pages = math.ceil(total_books / per_page)
        page = min(max(1, int(request.args.get('page', 1))), total_pages) if total_pages > 0 else 1
        offset = (page - 1) * per_page

        # Add LIMIT and OFFSET to base query
        query = base_query + f" LIMIT {per_page} OFFSET {offset}"
        
        # Debug print
        print(f"Final query: {query}")
        print(f"Page: {page}, Offset: {offset}")

        # Execute query
        print("Executing main query...")
        books = conn.execute(query, params).fetchall()
        print(f"Number of books returned: {len(books)}")
        
        books = [process_book_data(book) for book in books]
        conn.close()

        # Calculate book range for display
        start_book = (page - 1) * per_page + 1
        end_book = min(start_book + per_page - 1, total_books)

        return render_template('index.html', 
                             books=books, 
                             current_page=page,
                             total_pages=total_pages,
                             total_books=total_books,
                             start_book=start_book,
                             end_book=end_book,
                             category=category_filter,
                             language=language_filter,
                             rating=rating_filter,
                             search=search_term)

    except Exception as e:
        print(f"Error in home route: {str(e)}")
        import traceback
        traceback.print_exc()
        return render_template('index.html', 
                             books=[], 
                             current_page=1,
                             total_pages=0,
                             total_books=0,
                             error="Failed to load books. Please try again later.")

@app.route('/book/<int:book_id>')
def book_detail(book_id):
    conn = get_db_connection()
    book = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
    conn.close()

    if book is None:
        return "Book not found", 404

    # Process book data
    book = process_book_data(book)

    return render_template('book_detail.html', book=book)

@app.route('/download/<int:book_id>')
def download(book_id):
    conn = get_db_connection()
    book = conn.execute("SELECT file_path FROM books WHERE id = ?", (book_id,)).fetchone()
    conn.close()

    if book is None:
        return "Book not found", 404

    file_path = book['file_path']
    file_path = os.path.normpath(file_path)
    directory = os.path.dirname(file_path)
    filename = os.path.basename(file_path)
    return send_from_directory(directory, filename, as_attachment=True)

@app.route('/<path:path>')
def serve_file(path):
    try:
        print(f"\nRequest Details:")
        print(f"Path requested: {path}")
        print(f"Referrer: {request.referrer}")
        print(f"User Agent: {request.user_agent}")
        
        full_path = os.path.join(os.getcwd(), path)
        if os.path.exists(full_path):
            return send_from_directory('.', path)
        
        if path.endswith('.png'):
            jpg_path = path.rsplit('.', 1)[0] + '.jpg'
            jpg_full_path = os.path.join(os.getcwd(), jpg_path)
            if os.path.exists(jpg_full_path):
                print(f"Redirecting {path} to {jpg_path}")
                return send_from_directory('.', jpg_path)
        
        print(f"File not found: {full_path}")
        abort(404)
        
    except Exception as e:
        print(f"Error serving file: {path}")
        print(f"Error details: {str(e)}")
        abort(404)

if __name__ == '__main__':
    app.run(port=8000, debug=True)