Below are guidelines and an example implementation to display a maximum of 10 books on your main page, including how to handle a default image or display a custom image if one exists.

1. Limiting the Books to 10 on the Main Page
Server-Side (Python):
You should limit the number of books returned by your query on the server side. For example:
```python
@app.route('/')
def index():
    # ... (your existing code for filters and search)
    # Limit the results to 10
    query += " LIMIT 10"

    conn = get_db_connection()
    books = conn.execute(query, params).fetchall()
    conn.close()

    return render_template('index.html', books=books, current_page=page)
```


This ensures that only 10 books are passed to the template. No need to limit them again in the template since the query enforces that limit.


2. Retrieving and Displaying Book Information in index.html
Template Structure:
Your index.html will loop through the books passed from Flask. For each book, you’ll display metadata like title, author, rating, and a "Download PDF" link. Use Jinja2 templating to iterate through the list.

Example index.html snippet:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
    <title>BookStore</title>
    <!-- Include your CSS files here -->
</head>
<body>
    <!-- Filters Form Section Here (if you have it) -->

    <!-- Display Books Section -->
    <div class="books-container">
        {% for book in books %}
        <div class="book-card">
            <!-- Book Image -->
            <div class="book-image">
                <img 
                    src="{{ book.image_path if book.image_path else url_for('static', filename='images/default.jpg') }}" 
                    alt="{{ book.title }}"
                    width="200" height="300"
                >
            </div>

            <!-- Book Title -->
            <h3>{{ book.title }}</h3>

            <!-- Book Author -->
            <p>By {{ book.author }}</p>

            <!-- Rating and Reviews -->
            <p>
                {% if book.rating %}
                    <span class="stars">Rating: {{ book.rating }} ★</span>
                {% else %}
                    <span>No Rating</span>
                {% endif %}
                ({{ book.reviews_count or 0 }} Reviews)
            </p>

            <!-- Download Link -->
            <a href="{{ url_for('download', book_id=book.id) }}" class="download-button">Download PDF</a>
        </div>
        {% endfor %}
    </div>
</body>
</html>
```

