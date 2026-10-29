# CSE 341 - Books Web Service (Week 01)


A read-only Books API built with Node.js, Express 5 and MongoDB Atlas.


**Deployed URL:** https://cse341-books-w26l.onrender.com


## Endpoints


| Method | Path | Description | Success | Failure |
| --- | --- | --- | --- | --- |
| GET | `/` | Health check | 200 | - |
| GET | `/books` | All books | 200 (JSON array) | 500 |
| GET | `/books/:id` | One book by `id` | 200 (JSON object) | 404, 500 |


Error bodies are always JSON: `{ "message": "Book not found" }` or `{ "message": "Internal server error" }`.


## Data model


Each document in the `books` collection has four required string fields:


| Field | Example |
| --- | --- |
| `id` | `b1` |
| `author` | `Chinua Achebe` |
