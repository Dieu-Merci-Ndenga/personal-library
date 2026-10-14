# Personal Library

A small full-stack reading room for keeping track of books and the notes that make them worth remembering.

## What it does

- Add books to a MongoDB-backed collection.
- Select a book to view its notes.
- Add or remove notes without leaving the page.
- Remove one book or clear the complete collection.
- Use the JSON API directly from another client.

## Run locally

1. Install Node.js and MongoDB access.
2. Copy `.env.example` to `.env`.
3. Set `DB` to your MongoDB connection string and choose a `NODE_ENV` value.
4. Install dependencies and start the server:

```sh
npm install
npm start
```

The app is available at `http://localhost:3000`.

## Test

The functional suite runs against the configured database:

```sh
npm test
```

The API routes are defined in `routes/api.js`:

- `GET /api/books`
- `POST /api/books`
- `DELETE /api/books`
- `GET /api/books/:id`
- `POST /api/books/:id`
- `DELETE /api/books/:id`

Keep `.env` private. The example file contains placeholders only.


