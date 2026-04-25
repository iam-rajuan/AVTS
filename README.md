# AVTS

AVTS is a monorepo with:

- `frontend/`: a React + Vite client
- `backend/`: an Express + Socket.IO API

## Requirements

- Node.js 20+
- npm
- MongoDB connection string for the backend
- Mapbox token for maps

## Setup

Install dependencies from the repo root:

```bash
npm install
```

Create local env files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in the required values:

- `backend/.env`
  - `DB_CONNECT`
  - `JWT_SECRET`
  - `MAPBOX_API`
  - `PORT`
- `frontend/.env`
  - `VITE_BASE_URL`
  - `VITE_GOOGLE_MAPS_API_KEY`
  - `VITE_MAPBOX_API`

## Run

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Or use the root scripts:

```bash
npm run backend
npm run frontend
```

## Build

Build the frontend from the repo root:

```bash
npm run frontend:build
```

## Notes

- `.env` files are intentionally ignored and should never be committed.
- The backend API details are documented in `backend/README.md`.
