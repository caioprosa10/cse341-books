# CSE 341 - Books and Authors Web Service

A Books API built with Node.js, Express 5 and MongoDB Atlas. Books and authors both
support full CRUD operations, and every book references its author through an `authorId`
field.

- **Deployed URL:** https://cse341-books-w26l.onrender.com
- **Deployed documentation:** https://cse341-books-w26l.onrender.com/api-docs
- **Week 02 specification:** [spec-week02.md](./spec-week02.md)

## Endpoints

| Method | Path | Description | Success | Failure |
| --- | --- | --- | --- | --- |
| GET | `/` | Health check | 200 | - |
| GET | `/books` | All books | 200 (JSON array) | 500 |
| GET | `/books/:id` | One book by `id` | 200 (JSON object) | 404, 500 |
| POST | `/books` | Create a book | 201 (created book) | 400, 500 |
| PUT | `/books/:id` | Update a book | 200 (updated book) | 400, 404, 500 |
| DELETE | `/books/:id` | Delete a book | 204 (no body) | 404, 500 |
| GET | `/authors` | All authors | 200 (JSON array) | 500 |
| GET | `/authors/:id` | One author by `id` | 200 (JSON object) | 404, 500 |
| POST | `/authors` | Create an author | 201 (created author) | 400, 500 |
| PUT | `/authors/:id` | Update an author | 200 (updated author) | 400, 404, 500 |
| DELETE | `/authors/:id` | Delete an author | 204 (no body) | 404, 409, 500 |

Error bodies are always JSON with a single `message` property, for example
`{ "message": "Book not found" }`. A `204` response has an empty body. MongoDB's `_id`
is never returned.

`DELETE /authors/:id` answers `409 Conflict` when the author still has at least one book.
The request is valid, so the problem is the state of the data, not the request itself.

## Data model

### `books` collection

| Field | Type | Example |
| --- | --- | --- |
| `id` | string | `b1` |
| `authorId` | string | `a1` |
| `title` | string | `Things Fall Apart` |
| `publicationDate` | string | `1958-06-17` |

### `authors` collection

| Field | Type | Example |
| --- | --- | --- |
| `id` | string | `a1` |
| `name` | string | `Chinua Achebe` |
| `birthYear` | number | `1930` |

`books.authorId` stores the value of `authors.id`. The author's name is not duplicated in
the book document, and a book is rejected with `400` when its `authorId` does not match an
existing author.

Starting data for both collections is in [`seed-authors.json`](./seed-authors.json) and
[`seed-books.json`](./seed-books.json).

## Running locally

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `PORT`, `MONGODB_URI` and `MONGODB_DB_NAME`.
3. `npm run swagger` to generate `swagger.json`.
4. `npm run dev`
5. Open http://127.0.0.1:3000/api-docs and test the routes with **Try it out**.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Start the server (used by Render) |
| `npm run dev` | Start the server with nodemon and `.env` |
| `npm run swagger` | Regenerate `swagger.json` from the `@openapi` comments |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and apply safe fixes |

`swagger.json` is generated from the `@openapi` comments in `src/router.js` and `app.js`.
It is committed to the repository so the deployed app can serve the documentation without
`swagger-jsdoc` in production. Regenerate it whenever a route or a comment changes.

## Project structure

```
app.js                     Express app, /api-docs, health check
server.js                  Database connection and server start
swagger.js                 Generates swagger.json from the @openapi comments
swagger.json               Generated OpenAPI document served at /api-docs
src/router.js              All routes and their @openapi documentation
src/db/connect.js          MongoDB connection
src/models/books.js        Book database functions
src/models/authors.js      Author database functions
src/controllers/books.js   Book request handling and validation
src/controllers/authors.js Author request handling and validation
src/validation.js    Shared field validation helpers
```
