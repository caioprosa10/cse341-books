# CSE 341 - Books Web Service (Week 01)

A read-only Books API built with Node.js, Express 5 and MongoDB Atlas.

**Deployed URL:** _not deployed yet - add the Render URL here_

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
| `title` | `Things Fall Apart` |
| `publicationDate` | `1958-06-17` (ISO 8601) |

## Local setup

```bash
npm install
cp .env.example .env   # then fill in your Atlas connection string
npm run dev
```

`.env` is gitignored and must never be committed.

| Variable | Required | Notes |
| --- | --- | --- |
| `PORT` | yes | Local only; Render provides it in production |
| `MONGODB_URI` | yes | Atlas connection string |
| `MONGODB_DB_NAME` | no | Defaults to `practice`; set to `cse341-books-db` |

## Scripts

| Script | Command |
| --- | --- |
| `npm run dev` | `nodemon --env-file=.env server.js` |
| `npm start` | `node server.js` (used by Render) |
| `npm run lint` | `eslint .` |

## Project structure

```
cse341-books/
|-- app.js                     Express app, root route, mounts the router
|-- server.js                  Connects to MongoDB, then starts listening
|-- eslint.config.js           Course coding standards
|-- seed-books.json            Seed documents for the Atlas Data Explorer
`-- src/
    |-- db/connect.js          connectToDb / getDb - one shared connection
    |-- router.js              Paths to handlers
    |-- controllers/books.js   Status codes and response bodies
    `-- models/books.js        MongoDB queries
```

Controllers never query MongoDB directly; models never touch `req` or `res`.
