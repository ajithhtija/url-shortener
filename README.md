# URL Shortener

A simple URL shortener built with Node.js, Express and MongoDB.

Quick start

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `PORT`.
2. npm install
3. npm run dev

API

- POST /api/url - body: { originalUrl, customId? }
- GET /api/url - list all urls
- GET /:id - redirect to original URL
