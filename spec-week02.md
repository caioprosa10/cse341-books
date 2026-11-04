# Books API - Week 02 Specification

This document contains the Week 02 specification for the Books API. Version 1 is the
first draft of each feature. Version 2 is the revised specification that was used as the
implementation checklist after the Version 1 draft was evaluated.

- Repository: https://github.com/caioprosa10/cse341-books
- Deployed application: https://cse341-books-w26l.onrender.com
- Deployed documentation: https://cse341-books-w26l.onrender.com/api-docs

---

# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author
and the API supports all CRUD operations for books. Every book route must be documented
and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route
parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must
match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status
code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render
application. The deployed Swagger page at `/api-docs` must allow someone to test every
book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add an `authors` collection to the Books API and expose all CRUD operations for authors.
Authors are the parent side of the relationship with books, so the author API must exist
and be testable before a book can reference an author. Every author route must be
documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required, the author's full name
- `birthYear`: number, required, the four digit year the author was born

Authors use custom string ids instead of MongoDB `_id` values for route parameters, the
same approach already used for books.

Example document:

    {
      "id": "a1",
      "name": "Chinua Achebe",
      "birthYear": 1930
    }

### Relationship to Books
A book points at an author through `books.authorId`, which stores the value of
`authors.id`. The author document does not store a list of its books, so the reference
only travels in one direction: from the book to the author.

Because books depend on authors, an author who still has at least one book must not be
deleted. Deleting that author would leave books pointing at an author id that no longer
exists. A delete request for an author who still has books is rejected with a `409`
status code, and the client is told to delete or reassign the books first.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a4",
      "name": "Example Author",
      "birthYear": 1980
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "Updated Author",
      "birthYear": 1981
    }

The `id` is taken from the route and cannot be changed, because books reference it.

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has at least one book
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route, including a `requestBody` with an example JSON
body for `POST /authors` and `PUT /authors/:id`.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render
application. The deployed Swagger page at `/api-docs` must allow someone to test every
author route from the browser.

---

# Evaluation of Version 1

The Version 1 specification above was reviewed against four questions, both by hand and
with the help of AI. These are the problems that were found.

### 1. Are there any bugs or short-sighted decisions in this specification?
- **Field types were never validated.** Version 1 only said a field was "required". A
  client could send `"birthYear": "mil setecentos"` or `"title": 12345` and the API would
  store it, because a non-empty value passes a `required` check. The spec needs explicit
  types and a valid range for `birthYear`.
- **`birthYear: 0` and empty strings are edge cases.** A naive truthiness check such as
  `if (!birthYear)` rejects `0` and accepts `"   "`. The spec must say that strings are
  trimmed and must not be empty, and that `birthYear` is checked as a number.
- **`PUT` was not clearly a full replacement.** Version 1 listed the required fields in
  the body but did not say what happens to a field the client leaves out. It needs to say
  that `PUT` replaces the listed fields and that a missing one is a `400`, not a silent
  partial update.
- **Changing an author `id` would break books.** Version 1 did not forbid it anywhere
  except in a sentence in the author `PUT` route. The rule is now explicit: `id` is
  immutable and any `id` in a `PUT` body is ignored.
- **Nothing said what happens to unknown fields.** A client could post
  `{ "id": "a9", "name": "X", "birthYear": 1900, "isAdmin": true }` and the extra field
  would be written to the database. The spec now says only the known fields are persisted.
- **Deleting a book was not checked against the relationship.** Deleting a book is safe
  for data integrity, because nothing references a book. This was confirmed rather than
  assumed, and it is now written down so the asymmetry with author delete is intentional
  instead of accidental.

### 2. Are there any security considerations that are missing?
- **Mass assignment.** Writing `req.body` straight into MongoDB lets a client add any
  field it wants. Version 2 requires that the controller build a new object from the known
  fields only, never spread the request body.
- **Operator injection.** A JSON body can contain a MongoDB operator, for example
  `{ "id": { "$ne": null } }`, which would match documents a plain string never would.
  Version 2 requires that `id` values from the route and from the body are rejected unless
  they are strings.
- **Leaking internal errors.** Returning `error.message` to the client can expose the
  database name, the driver version, or part of a connection string. Version 2 requires
  that the client only ever receives a short, fixed message, and that the real error is
  logged on the server.
- **Exposing `_id`.** MongoDB's `_id` is an implementation detail that the API never
  promised. Version 2 requires that responses are projected so `_id` is not returned.
- **No request size limit.** `express.json()` defaults to a 100kb limit, which is
  acceptable for this API, so Version 2 records the limit as a deliberate decision rather
  than leaving it undocumented.

### 3. Are there any efficiency concerns with the current endpoint design?
- **One query per validation step.** Creating a book runs a duplicate check and an author
  existence check before the insert. Three round trips is acceptable for an API of this
  size, and the correctness of the relationship is worth more than saving a query, so the
  decision is recorded instead of optimised away.
- **`authorHasBooks` should not load documents.** Counting books with
  `countDocuments({ authorId: id })` and limiting the count to 1 is enough to answer the
  question. The spec now says that the check must not pull book documents into memory.
- **Unindexed lookups.** Every route queries by the custom `id` field, which has no index
  by default, so each lookup is a collection scan. Version 2 recommends a unique index on
  `books.id`, a unique index on `authors.id`, and an index on `books.authorId`.
- **No pagination on the collection routes.** `GET /books` and `GET /authors` return every
  document. With three authors and a handful of books that is fine, so Version 2 records
  pagination as a known future change rather than scope for this week.

### 4. Are any response examples or error behaviors unclear?
- **Error body shape was never specified.** Version 1 listed status codes but never said
  what the body looked like. Version 2 fixes the shape as
  `{ "message": "<short description>" }` for every non-`204` failure.
- **`204` had no stated body.** Version 2 states explicitly that `204` responses have an
  empty body, which is why `res.status(204).send()` is used instead of `.json()`.
- **Two different `400` cases shared one description.** A missing field and a bad
  `authorId` are different problems for the client. Version 2 gives each `400` its own
  message so Swagger output tells the two apart.
- **The success body of `PUT` was ambiguous.** Version 2 states that `PUT` returns the
  document as it exists after the update, not the request body echoed back.

---

# Books API Week 02 Spec - Version 2

Version 2 is the specification that was implemented. It is the checklist that the GitHub
issues and the Test Plans were written from.

## Conventions that apply to every route

### Response format
- Every success response that has a body is `application/json`.
- Every failure response body is a JSON object with a single `message` property:
  `{ "message": "Book not found" }`.
- A `204` response has an empty body.
- `_id` is never included in a response. Responses are projected with `{ projection: { _id: 0 } }`.

### Validation rules
- `id`, `authorId`, `title`, `publicationDate` and `name` must be strings. A value of any
  other type is a `400`, which also blocks MongoDB operator objects such as `{ "$ne": null }`.
- String fields are trimmed before they are validated and before they are stored. A field
  that is empty after trimming is treated as missing and returns `400`.
- `birthYear` must be an integer between `-3000` and the current year. `0` is only invalid
  because it is outside that range, never because it is falsy.
- `publicationDate` must be a `YYYY-MM-DD` string that represents a real calendar date.
- Only the fields named in this specification are stored. The controller builds a new
  object field by field and never spreads `req.body` into the database call.
- A custom `id` is immutable. An `id` property in a `PUT` body is ignored, and the `id`
  from the route is the only one used.
- `PUT` is a full replacement of the listed fields. A missing required field is a `400`,
  not a partial update.
- The JSON body limit is the `express.json()` default of 100kb. A larger body is rejected
  by Express before it reaches a controller.

### Error handling
- Every controller wraps its work in `try`/`catch`.
- The `catch` block logs the real error on the server with `console.error` and returns a
  fixed, generic message to the client. Driver and database details are never returned.

### Recommended indexes
- `authors.id`: unique
- `books.id`: unique
- `books.authorId`: non-unique, supports the `authorHasBooks` check

## Feature 1: Book CRUD Operations and Author References

### Data model
Collection: `books`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Custom id such as `b1`. Immutable. Unique. |
| `authorId` | string | yes | Must equal the `id` of an existing author document. |
| `title` | string | yes | Trimmed, not empty. |
| `publicationDate` | string | yes | `YYYY-MM-DD`, must be a real date. |

The Week 01 `author` field, which stored the author's name as text, is removed. The name
is no longer duplicated in the book document; it is reached through `authorId`.

### Relationship rules
- `books.authorId` references `authors.id`.
- `POST /books` and `PUT /books/:id` return `400` when `authorId` does not match an
  existing author. The check runs before any write.
- Deleting a book never requires a relationship check, because no document references a
  book.

### Routes

| Method | Path | Success | Failures |
| --- | --- | --- | --- |
| GET | `/books` | `200` array of books | `500` |
| GET | `/books/:id` | `200` book object | `404`, `500` |
| POST | `/books` | `201` created book | `400`, `500` |
| PUT | `/books/:id` | `200` updated book | `400`, `404`, `500` |
| DELETE | `/books/:id` | `204` empty body | `404`, `500` |

#### GET /books
Returns every book document, `_id` excluded.

- `200` with an array. An empty collection returns `200` with `[]`, not `404`.
- `500` on an unexpected server or database error.

#### GET /books/:id
- `200` with the matching book.
- `404` `{ "message": "Book not found" }` when no book has that id.
- `500` on an unexpected server or database error.

#### POST /books
Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

- `201` with the created book.
- `400` `{ "message": "Missing or invalid book fields: id, authorId, title, publicationDate are required." }`
  when a field is missing, is not a string, or is empty after trimming.
- `400` `{ "message": "publicationDate must be a valid date in YYYY-MM-DD format." }`
  when the date is malformed or not a real calendar date.
- `400` `{ "message": "A book with that id already exists." }` when `id` is taken.
- `400` `{ "message": "authorId does not match an existing author." }` when the author
  does not exist.
- `500` on an unexpected server or database error.

Validation order: field presence and types, then date format, then duplicate `id`, then
author existence, then the insert.

#### PUT /books/:id
Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

- `200` with the book as stored after the update.
- `400` for the same field, date and `authorId` problems as `POST /books`.
- `404` `{ "message": "Book not found" }` when the book does not exist.
- `500` on an unexpected server or database error.

An `id` sent in the body is ignored. The route `id` identifies the document.

Validation order: field presence and types, then date format, then book existence, then
author existence, then the update.

#### DELETE /books/:id
- `204` with an empty body.
- `404` `{ "message": "Book not found" }` when the book does not exist.
- `500` on an unexpected server or database error.

### Swagger documentation
Every book route has an `@openapi` comment in `src/router.js` with a summary, the `Books`
tag, path parameters where they apply, and every documented status code. `POST /books` and
`PUT /books/:id` include a `requestBody` with the schema, the required fields and an
example JSON body, so the route can be executed from the browser without typing a body by
hand.

### Files
- `src/models/books.js`
- `src/controllers/books.js`
- `src/router.js`
- `swagger.js`, `swagger.json`

### Deployment expectations
Every book route works locally at `http://127.0.0.1:3000/api-docs` and from
`https://cse341-books-w26l.onrender.com/api-docs`.

## Feature 2: Author CRUD Operations

### Data model
Collection: `authors`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Custom id such as `a1`. Immutable. Unique. |
| `name` | string | yes | Trimmed, not empty. |
| `birthYear` | number | yes | Integer between `-3000` and the current year. |

### Relationship rules
- `authors.id` is referenced by `books.authorId`.
- An author who still has at least one book cannot be deleted. The check is a
  `countDocuments({ authorId: id })` with a limit of 1, so no book documents are loaded.
- An author `id` cannot be changed, because books store it.

### Routes

| Method | Path | Success | Failures |
| --- | --- | --- | --- |
| GET | `/authors` | `200` array of authors | `500` |
| GET | `/authors/:id` | `200` author object | `404`, `500` |
| POST | `/authors` | `201` created author | `400`, `500` |
| PUT | `/authors/:id` | `200` updated author | `400`, `404`, `500` |
| DELETE | `/authors/:id` | `204` empty body | `404`, `409`, `500` |

#### GET /authors
- `200` with an array of authors, `_id` excluded. An empty collection returns `[]`.
- `500` on an unexpected server or database error.

#### GET /authors/:id
- `200` with the matching author.
- `404` `{ "message": "Author not found" }`.
- `500` on an unexpected server or database error.

#### POST /authors
Request body:

    {
      "id": "a4",
      "name": "Example Author",
      "birthYear": 1980
    }

- `201` with the created author.
- `400` `{ "message": "Missing or invalid author fields: id and name must be non-empty strings." }`
- `400` `{ "message": "birthYear must be an integer year no later than the current year." }`
- `400` `{ "message": "An author with that id already exists." }`
- `500` on an unexpected server or database error.

Validation order: field presence and types, then `birthYear` range, then duplicate `id`,
then the insert.

#### PUT /authors/:id
Request body:

    {
      "name": "Updated Author",
      "birthYear": 1981
    }

- `200` with the author as stored after the update.
- `400` for the same field and `birthYear` problems as `POST /authors`.
- `404` `{ "message": "Author not found" }`.
- `500` on an unexpected server or database error.

An `id` sent in the body is ignored.

#### DELETE /authors/:id
- `204` with an empty body.
- `404` `{ "message": "Author not found" }` when the author does not exist.
- `409` `{ "message": "Author cannot be deleted because they still have books." }` when at
  least one book references the author.
- `500` on an unexpected server or database error.

`409 Conflict` is used instead of `400`, because the request itself is well formed. The
problem is the current state of the data, not the syntax of the request, and the client
can fix it by deleting or reassigning the author's books and sending the same request
again.

### Swagger documentation
Every author route has an `@openapi` comment in `src/router.js` with a summary, the
`Authors` tag, path parameters where they apply, and every documented status code,
including the `409`. `POST /authors` and `PUT /authors/:id` include a `requestBody` with
the schema, the required fields and an example JSON body.

### Files
- `src/models/authors.js`
- `src/controllers/authors.js`
- `src/router.js`
- `swagger.js`, `swagger.json`

### Deployment expectations
Every author route works locally at `http://127.0.0.1:3000/api-docs` and from
`https://cse341-books-w26l.onrender.com/api-docs`.

## Out of scope for Week 02
These were identified during the evaluation and deliberately left out of this week's work.

- Pagination and filtering on `GET /books` and `GET /authors`.
- Authentication and authorization on the write routes. Every route is public this week.
- Rate limiting.
- A route that returns a book together with its author document, for example through an
  aggregation `$lookup`.
- Cascading delete of an author's books. The `409` response puts that decision in the
  client's hands instead.
