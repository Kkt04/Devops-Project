# 🌿 ArtisanHub — Handcrafted Goods Marketplace

A full-stack e-commerce platform connecting independent artisans with customers who value craft, quality, and story.

## 🏗️ Architecture

artisanhub/
├── .github/workflows/   # CI, PR checks, EC2 deploy
├── client/              # React 18 + Vite frontend
└── server/              # Express + Prisma + SQLite backend

## 🚀 Quick Start

git clone https://github.com/your-username/artisanhub
cd artisanhub
chmod +x dev-setup.sh && ./dev-setup.sh

Terminal 1: cd server && npm run dev
Terminal 2: cd client && npm run dev

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| API      | http://localhost:5001  |
| Health   | /api/health            |

## 📡 API Reference

| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | /api/products              | List (filter/sort/search)|
| GET    | /api/products/:id          | Single product           |
| POST   | /api/products              | Create product           |
| PUT    | /api/products/:id          | Update product           |
| DELETE | /api/products/:id          | Delete product           |
| GET    | /api/products/categories   | All categories           |
| POST   | /api/orders                | Create order             |
| GET    | /api/orders/:id            | Get order                |
| GET    | /api/health                | Health check             |

## 🧪 Testing

cd server && npm test          # Jest + Supertest
cd client && npm test          # Vitest + Testing Library

## 🔄 CI/CD

- ci.yml       → lint + test + build on every push/PR
- pr-checks.yml → ESLint gate on every PR
- deploy.yml   → SSH deploy to EC2 on push to main

## Required Secrets

| Secret        | Description                  |
|---------------|------------------------------|
| EC2_HOST      | EC2 public IP or hostname    |
| EC2_USER      | SSH username (e.g. ubuntu)   |
| EC2_SSH_KEY   | Private key PEM contents     |

## 🛠️ Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, React Router v6         |
| Styling  | Pure CSS custom properties              |
| Backend  | Node.js, Express.js                     |
| ORM      | Prisma                                  |
| Database | SQLite (dev) / PostgreSQL (prod-ready)  |
| Testing  | Vitest + Testing Library / Jest + Supertest |
| CI/CD    | GitHub Actions                          |
| Deploy   | Render (backend), Vercel (frontend)     |