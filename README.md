# 🌿 ArtisanHub — Handcrafted Goods Marketplace


> Full-stack e-commerce platform built with React + Node.js, deployed on AWS ECS Fargate via a fully automated CI/CD pipeline.



## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Docker](#-docker)
- [API Endpoints](#-api-endpoints)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Infrastructure (Terraform)](#-infrastructure-terraform)
- [GitHub Secrets Setup](#-github-secrets-setup)
- [Testing](#-testing)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express 5 (in-memory, no database) |
| Testing | Vitest + Testing Library (client) / Jest + Supertest (server) |
| Containerisation | Docker (multi-stage build), Docker Compose |
| Infrastructure | Terraform (AWS — S3, ECR, ECS Fargate, CloudWatch) |
| CI/CD | GitHub Actions (4-phase pipeline) |

---

## 📁 Project Structure

```
.
├── client/                  # React + Vite frontend
│   ├── src/
│   ├── Dockerfile           # Multi-stage: Node build → Nginx serve
│   └── nginx.conf           # SPA routing + /api proxy
├── server/                  # Express API (in-memory data)
│   └── src/
├── infra/
│   └── k8s/                 # Kubernetes manifests (Phase 4 — ready)
│       ├── namespace.yaml
│       ├── deployment.yaml
│       └── service.yaml
├── terraform/               # AWS infrastructure as code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── .github/workflows/
│   └── deploy.yml           # Unified CI/CD pipeline
├── Dockerfile               # Server image (multi-stage)
└── docker-compose.yml       # Local orchestration
```

---

## 💻 Local Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### Option 1 — Run directly

```bash
chmod +x dev-setup.sh && ./dev-setup.sh

# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| API      | http://localhost:5001  |

### Option 2 — Docker Compose

```bash
docker compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| API      | http://localhost:5001  |

---

## 🐳 Docker

The server uses a **multi-stage Dockerfile** (rubric requirement):

| Stage | Base image | Purpose |
|---|---|---|
| `builder` | `node:20-alpine` | Install production deps |
| `production` | `node:20-alpine` | Run app as non-root user `artisan` |

The client has its own Dockerfile:

| Stage | Base image | Purpose |
|---|---|---|
| `builder` | `node:20-alpine` | `vite build` |
| `production` | `nginx:1.27-alpine` | Serve static assets + proxy `/api` |

---

## 📡 API Endpoints

| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| GET    | /api/health               | Health check           |
| GET    | /api/products             | List all products      |
| GET    | /api/products/:id         | Get single product     |
| POST   | /api/products             | Create product         |
| PUT    | /api/products/:id         | Update product         |
| DELETE | /api/products/:id         | Delete product         |
| GET    | /api/products/categories  | All categories         |
| POST   | /api/orders               | Place an order         |
| GET    | /api/orders/:id           | Get order by ID        |

---

## 🚀 CI/CD Pipeline

The pipeline runs automatically on every push to `main` in four sequential phases:

```
Push to main
    ↓
Phase 1 — Tests (Jest + Vitest, JUnit reports uploaded)
    ↓
Phase 2 — Terraform (init → validate → plan → apply)
    ↓
Phase 3 — Docker Build & ECR Push
    ↓
Phase 3b — Deploy to ECS Fargate (+ verify running)
```

### Phase 1 — Testing
- Runs server tests with **Jest** + **jest-junit** (generates `junit.xml`)
- Runs client tests with **Vitest** (generates `junit.xml`)
- Uploads both reports as GitHub Actions artifacts (retained 30 days)
- Also runs ESLint and `vite build` to catch build-time errors

### Phase 2 — Terraform
- Configures AWS credentials from GitHub Secrets
- `terraform init` with **S3 backend** for persistent state
- Imports any pre-existing AWS resources (idempotent — safe on first run)
- `terraform validate` → `terraform plan` → `terraform apply`

### Phase 3 — Docker Build & ECS Deploy
- Builds React client and embeds into server image
- Builds multi-stage Docker image tagged with `latest` and `${{ github.sha }}`
- Pushes both tags to **Amazon ECR**
- Registers new ECS task definition revision with the new image
- Updates ECS service with `--force-new-deployment`
- Waits for service stability (`aws ecs wait services-stable`)
- Verifies `runningCount == desiredCount` and prints the public IP

---

## 🏗 Infrastructure (Terraform)

All AWS resources are defined in `terraform/` and provisioned automatically by the pipeline:

| Resource | Details |
|---|---|
| **S3 Bucket** | `artisan-hub-artifacts-<account_id>` — versioning ✅, AES256 encryption ✅, public access blocked ✅ |
| **S3 Backend** | Terraform state stored in same bucket under `terraform/state/terraform.tfstate` |
| **ECR Repository** | `artisan-hub-backend` — image scanning on push, lifecycle policy (keep last 10) |
| **ECS Cluster** | `artisan-hub-cluster` — Container Insights enabled |
| **ECS Task Definition** | Fargate, 256 CPU / 512 MB, CloudWatch logging |
| **ECS Service** | `artisan-hub-service` — public IP, default VPC subnets |
| **Security Group** | Ingress 5001/tcp, egress all |
| **CloudWatch Log Group** | `/ecs/artisan-hub` — 7-day retention |

### Kubernetes Manifests (Phase 4 — ready to enable)

Manifests are in `infra/k8s/` and satisfy all rubric requirements:
- `namespace: artisan-hub` (non-default namespace)
- `replicas: 2` (minimum 2)
- CPU + memory `requests` and `limits`
- Liveness + readiness probes on `/api/health`

---

## 🔐 GitHub Secrets Setup

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | From AWS Learner Lab → AWS Details |
| `AWS_SECRET_ACCESS_KEY` | From AWS Learner Lab → AWS Details |
| `AWS_SESSION_TOKEN` | From AWS Learner Lab → AWS Details |
| `AWS_REGION` | `us-east-1` |

> ⚠️ **Learner Lab tokens expire every ~4 hours.** Re-add the three credential secrets at the start of each new lab session before triggering the pipeline.

---

## 🧪 Testing

```bash
# Server (Jest)
cd server && npm test
cd server && npm run test:coverage

# Client (Vitest)
cd client && npm test
cd client && npm run test:coverage
```
