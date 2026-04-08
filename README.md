# URL Shortener Workspace

This workspace contains a finished frontend in `client/` and backend boilerplate in `backend/`.

## Run the frontend

1. Open `client/`.
2. Run `npm install` if needed.
3. Start the dev server with `npm run dev`.

## Run the backend

1. Open `backend/`.
2. Run `node src/server.js` or `node --watch src/server.js`.
3. The backend listens on port `3001` by default.

## API shape

- `POST /api/links` creates a short link.
- `GET /api/links` lists stored links.
- `GET /:code` resolves a short link and redirects.