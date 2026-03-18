# 🌿 ArtisanHub — Handcrafted Goods Marketplace

Full-stack e-commerce platform. No database required — data lives in-memory on the server.

## Quick Start

chmod +x dev-setup.sh && ./dev-setup.sh

Terminal 1: cd server && npm run dev
Terminal 2: cd client && npm run dev

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| API      | http://localhost:5001 |

## API Endpoints

| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | /api/products            | List all products     |
| GET    | /api/products/:id        | Get single product    |
| POST   | /api/products            | Create product        |
| PUT    | /api/products/:id        | Update product        |
| DELETE | /api/products/:id        | Delete product        |
| GET    | /api/products/categories | All categories        |
| POST   | /api/orders              | Place an order        |
| GET    | /api/orders/:id          | Get order by id       |
| GET    | /api/health              | Health check          |

## Testing

cd server && npm test
cd client && npm test

## Tech Stack

- Frontend: React 18, Vite, React Router v6
- Backend: Node.js, Express (no database)
- Testing: Vitest + Testing Library / Jest + Supertest
- CI/CD: GitHub Actions
- Deploy: Render (backend), Vercel (frontend)