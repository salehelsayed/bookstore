# Phase 3 Code Implementation

## 1. Local Storage Setup

### 1.1. Create Storage Directory

- **Define Storage Path**
  - Decide on a consistent and secure directory within the project to store PDF files.
  - For example, create a directory named `storage/books/` at the root of the project:
    ```bash
    mkdir -p storage/books
    ```

- **Update `.gitignore`**
  - Add the storage directory to the `.gitignore` file to prevent large files from being tracked by Git.
    ```bash
    # .gitignore

    # Ignore storage directory
    storage/
    ```

### 1.2. Set Up Directory Structure

- **Organize Files**
  - Within `storage/books`, create subdirectories to organize files by **category** or **author**.
    - **By Category**:
      ```bash
      mkdir -p storage/books/fiction
      mkdir -p storage/books/nonfiction
      mkdir -p storage/books/science
      ```

    - **By Author**:
      ```bash
      mkdir -p storage/books/john_smith
      mkdir -p storage/books/jane_doe
      ```

- **Implement Naming Convention**
  - Decide on a naming convention for PDF files to avoid conflicts.
    - Use a format like `bookID_title.pdf`.
    - Replace spaces with underscores and convert titles to lowercase.

### 1.3. Manual Book Addition

- **Add Books to Local Storage**
  - Manually place PDF files into the appropriate subdirectories within `storage/books`.
  - Ensure each file follows the naming convention `bookID_title.pdf`.

### 1.4. Implement File Serving

- **Serve Static Files**

  ```python:Proj-BookStore/app.py
  # ... existing code ...

  @app.route('/files/<path:filename>')
  def serve_file(filename):
      # Security: Ensure the filename is safe
      from werkzeug.utils import secure_filename
      safe_filename = secure_filename(filename)
      return send_from_directory(
          directory=os.path.join(app.config['UPLOADED_FILES_DEST']),
          filename=safe_filename,
          as_attachment=True
      )

  # ... existing code ...
  ```

- **Create Download Route**

  ```python:Proj-BookStore/app.py
  # ... existing code ...

  @app.route('/download/<category>/<filename>')
  def download_file(category, filename):
      file_path = os.path.join(app.config['UPLOADED_FILES_DEST'], category)
      return send_from_directory(
          directory=file_path,
          filename=filename,
          as_attachment=True
      )

  # ... existing code ...
  ```

### 1.5. Update Frontend to Support Downloads

- **Add Download Links**
  - In `book-detail.html`, ensure the download button links to the download route.

    ```html:Proj-BookStore/templates/book-detail.html
    <a href="{{ url_for('download_file', category=book.category, filename=book.filename) }}">Download</a>
    ```

- **Logging**
  - Implement logging for download activities using Python's built-in `logging` module.

    ```python:Proj-BookStore/app.py
    import logging

    logging.basicConfig(level=logging.INFO)

    @app.route('/download/<category>/<filename>')
    def download_file(category, filename):
        logging.info(f"Download requested for {filename} in {category}")
        file_path = os.path.join(app.config['UPLOADED_FILES_DEST'], category)
        return send_from_directory(
            directory=file_path,
            filename=filename,
            as_attachment=True
        )

    # ... existing code ...
    ```

### 1.6. Security Measures

- **Authentication and Authorization**

  - Implement middleware to restrict access to download routes.

    ```python:Proj-BookStore/app.py
    # ... existing code ...
    from functools import wraps
    from flask import session, redirect, url_for

    # Authentication decorator
    def login_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'logged_in' in session and session['role'] == 'admin':
                return f(*args, **kwargs)
            else:
                return redirect(url_for('login'))
        return decorated_function

    # Protect download route
    @app.route('/download/<category>/<filename>')
    @login_required
    def download_file(category, filename):
        # ... existing download code ...
        pass

    # ... existing code ...
    ```

  - Ensure you have routes and templates for `login` and manage user sessions appropriately.

- **Input Validation**

  - Use form validation to ensure that inputs meet the required criteria.

    ```python:Proj-BookStore/app.py
    # ... existing code ...
    from wtforms import Form, StringField, SelectField, validators

    class DownloadForm(Form):
        category = SelectField('Category', choices=[('fiction', 'Fiction'), ('nonfiction', 'Non-Fiction'), ('science', 'Science')])
        filename = StringField('Filename', [validators.DataRequired()])

    @app.route('/download/<category>/<filename>')
    @login_required
    def download_file(category, filename):
        form = DownloadForm(request.form)
        if form.validate():
            # Process download
            pass
        else:
            return render_template('download.html', form=form)

    # ... existing code ...
    ```

- **Error Handling**

  - Implement error handling for file download operations to prevent application crashes.

    ```python:Proj-BookStore/app.py
    # ... existing code ...

    @app.errorhandler(404)
    def not_found_error(error):
        return 'File not found', 404

    @app.errorhandler(500)
    def internal_error(error):
        return 'An internal error occurred', 500

    # ... existing code ...
    ```

### 1.7. Additional Considerations

- **Logging**

  - Implement logging for download activities using Python's built-in `logging` module.

    ```python:Proj-BookStore/app.py
    # ... existing code ...
    import logging
    from logging.handlers import RotatingFileHandler

    # Set up logging
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/bookstore.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)

    app.logger.setLevel(logging.INFO)
    app.logger.info('BookStore startup')

    # ... existing code ...
    ```

- **Capacity Planning**

  - Monitor storage usage and plan for scaling storage as the application grows.

- **Backup Strategy**

  - Implement regular backups of the storage directory to prevent data loss.

---

This detailed guide provides step-by-step instructions for setting up local storage, handling file downloads using Python and Flask, updating the frontend, and implementing essential security measures.

### Questions

To ensure the implementation aligns with your requirements, could you please provide clarification on the following:

1. **Authentication System**: Do you have an existing authentication system, or would you like guidance on setting up user authentication and authorization?
2. **File Metadata Storage**: Should information about uploaded files (e.g., file path, book ID, title, category) be stored in a database for future retrieval and management?
3. **Admin Interface**: Will there be a dedicated admin interface for uploading and managing books, or should the upload form be integrated into the existing pages?
4. **Additional Security Requirements**: Are there any specific security or compliance standards you need to adhere to (e.g., GDPR, encryption at rest)?
5. **Future Scalability**: Do you foresee needing to scale storage (e.g., moving to cloud storage services) as the number of books grows?

Please let me know if you need further details or assistance with any of these points.