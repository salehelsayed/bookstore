<div class="filters">
  <form method="GET" action="/">
    <h4>Genre</h4>
    <label><input type="radio" name="category" value="all" checked>All</label><br>
    <label><input type="radio" name="category" value="Fiction">Fiction</label><br>
    <label><input type="radio" name="category" value="Non-Fiction">Non-Fiction</label><br>
    <label><input type="radio" name="category" value="Science">Science</label><br>

    <h4>Language</h4>
    <select name="language">
      <option value="all">All Languages</option>
      <option value="English">English</option>
      <option value="Arabic">Arabic</option>
    </select>

    <h4>Rating</h4>
    <label><input type="radio" name="rating" value="4">4+ stars</label><br>
    <label><input type="radio" name="rating" value="3">3+ stars</label><br>

    <button type="submit">Apply Filters</button>
  </form>
</div>
