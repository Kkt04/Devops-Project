# DevOps Final Phase — Complete Step-by-Step Guide

> Written for the **ArtisanHub** repo (`github.com/Kkt04/Devops-Project`).  
> Every command, every file, every AWS console screen — explained from scratch.

---

## Table of Contents

1. [Understand the Repo Structure](#1-understand-the-repo-structure)
2. [What You Are Building](#2-what-you-are-building)
3. [Tools You Need Installed](#3-tools-you-need-installed)
4. [Step 1 — Get AWS Credentials from AWS Academy](#4-step-1--get-aws-credentials-from-aws-academy)
5. [Step 2 — Add GitHub Secrets](#5-step-2--add-github-secrets)
6. [Step 3 — Verify Existing Folder Structure](#6-step-3--verify-existing-folder-structure)
7. [Step 4 — Review the Dockerfile](#7-step-4--review-the-dockerfile)
8. [Step 5 — Review Terraform Files](#8-step-5--review-terraform-files)
9. [Step 6 — Write Verification Scripts](#9-step-6--write-verification-scripts)
10. [Step 7 — Write the Cleanup Script](#10-step-7--write-the-cleanup-script)
11. [Step 8 — Review the GitHub Actions Pipeline](#11-step-8--review-the-github-actions-pipeline)
12. [Step 9 — Test Everything Locally First](#12-step-9--test-everything-locally-first)
13. [Step 10 — Verify on AWS Console](#13-step-10--verify-on-aws-console)
14. [Step 11 — Push to GitHub and Trigger Pipeline](#14-step-11--push-to-github-and-trigger-pipeline)
15. [Step 12 — Verify Pipeline on AWS Console](#15-step-12--verify-pipeline-on-aws-console)
16. [Cleanup](#16-cleanup)
17. [Troubleshooting](#17-troubleshooting)
18. [What If Your Repo Is Different?](#18-what-if-your-repo-is-different)

---

## 1. Understand the Repo Structure

The ArtisanHub repo looks like this with existing infrastructure files already present:

```
Devops-Project/
├── client/                  ← React + Vite frontend
│   ├── src/
│   │   ├── tests/           ← Vitest + Testing Library tests
│   │   └── main.jsx         ← frontend entry point
│   ├── package.json         ← frontend dependencies (own package.json)
│   └── Dockerfile           ← frontend Dockerfile (Nginx serve)
├── server/                  ← Node.js + Express backend
│   ├── src/
│   │   ├── index.js         ← entry point, runs on port 5001
│   │   ├── app.js           ← health check at /api/health
│   │   ├── data/            ← in-memory product data (no database)
│   │   └── tests/           ← Jest + Supertest tests
│   └── package.json         ← backend dependencies (own package.json)
├── terraform/               ← Existing Terraform config (root level)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars
├── infra/                   ← Kubernetes manifests (optional phase)
│   └── k8s/
├── .github/
│   └── workflows/           ← Existing CI/CD pipelines
│       ├── deploy.yml       ← Main 4-phase pipeline
│       └── main.yml
├── Dockerfile               ← Existing backend Dockerfile (root level)
├── docker-compose.yml       ← Local development orchestration
└── package.json             ← root package.json (if present, not for server)
```

> **Important Notes:**
> - No `prisma/` folder exists — this project uses **in-memory data storage**, not a database
> - Backend has its own `package.json` inside `server/` (not root level)
> - Frontend has its own `package.json` inside `client/` with Vitest tests
> - All infrastructure files already exist — no need to create new folders

---

## 2. What You Are Building

You will use the existing infrastructure files in the repo to deploy the backend to AWS ECS Fargate via the existing 4-phase GitHub Actions pipeline in `.github/workflows/deploy.yml`:

```
Devops-Project/
├── terraform/               ← Existing, update if needed
├── Dockerfile               ← Existing, update if needed
└── .github/
    └── workflows/
        └── deploy.yml       ← Existing, update if needed
```

**The 4 pipeline phases (already configured):**

| Phase | What it does |
|-------|-------------|
| Phase 1 — Tests | Runs Jest (server) + Vitest (client) tests, ESLint, Vite build, uploads test reports |
| Phase 2 — Terraform | Creates S3 bucket, ECR repo, ECS cluster, security group, CloudWatch logs |
| Phase 3 — Docker Build | Builds backend Docker image, pushes to ECR |
| Phase 4 — Deploy | Deploys to ECS Fargate, verifies health |

---

## 3. Tools You Need Installed

Check each one is installed before starting:

```bash
aws --version        # AWS CLI
terraform --version  # Terraform
docker --version     # Docker Desktop
node --version       # Node.js (should be 20+)
git --version        # Git
```

If anything is missing:
- AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
- Terraform: https://developer.hashicorp.com/terraform/install
- Docker Desktop: https://www.docker.com/products/docker-desktop

---

## 4. Step 1 — Get AWS Credentials from AWS Academy

Every time you start a new lab session, you need fresh credentials.

### How to get them — follow exactly:

1. Go to **https://awsacademy.instructure.com** and log in
2. Click your course → **Modules** → **Learner Lab**
3. Click **Start Lab** (green button top right)
4. Wait until the dot next to **AWS** turns **green** (takes ~1-2 min)
5. Click **AWS Details** (button at the top)
6. Click **Show** next to **"AWS CLI:"**

You will see a block like this — **copy everything inside it**:

```
[default]
aws_access_key_id=ASIA4EXAMPLE12345678
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
aws_session_token=IQoJb3JpZ2luX2VjEJr....(very long string, hundreds of characters)....
```

> These expire when your lab session ends. Every new session = new credentials.

### Paste them into AWS CLI config:

Open your terminal and run these **one line at a time**, replacing with your actual values:

```bash
aws configure set aws_access_key_id     ASIA4EXAMPLE12345678
aws configure set aws_secret_access_key wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
aws configure set aws_session_token     IQoJb3JpZ2luX2VjEJr....
aws configure set default.region        us-east-1
```

Verify it works:

```bash
aws sts get-caller-identity
```

You should see your account ID. Example:

```json
{
    "UserId": "AROA...",
    "Account": "443325993463",
    "Arn": "arn:aws:sts::443325993463:assumed-role/..."
}
```

Note your **Account ID** (the number) — you'll need it later.

---

## 5. Step 2 — Add GitHub Secrets

These secrets let GitHub Actions authenticate to AWS on your behalf.

### How to add them:

1. Go to your GitHub repo in the browser
2. Click the **Settings** tab (top of repo — not your profile settings)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. For each secret below, click **New repository secret**, enter the name and value, click **Add secret**

| Secret Name | Where to get the value |
|-------------|----------------------|
| `AWS_ACCESS_KEY_ID` | From AWS Academy Details → the `aws_access_key_id=` line |
| `AWS_SECRET_ACCESS_KEY` | From AWS Academy Details → the `aws_secret_access_key=` line |
| `AWS_SESSION_TOKEN` | From AWS Academy Details → the `aws_session_token=` line (the very long one) |
| `AWS_REGION` | Type literally: `us-east-1` |

After adding all four, the Secrets page should show:

```
Repository secrets (4)
  AWS_ACCESS_KEY_ID        Updated just now
  AWS_SECRET_ACCESS_KEY    Updated just now
  AWS_SESSION_TOKEN        Updated just now
  AWS_REGION               Updated X days ago
```

> **Every new lab session:** The AWS token/key/secret all expire. Go back and update the three AWS secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`) with the fresh values from AWS Details. `AWS_REGION` never changes.

---

## 6. Step 3 — Verify Existing Folder Structure

Run these commands from the **root of your cloned repo** to confirm all files exist:

```bash
# Check existing infrastructure files
ls -la terraform/          # Should show main.tf, variables.tf, outputs.tf, terraform.tfvars
ls -la .github/workflows/  # Should show deploy.yml, main.yml
ls -la server/src/tests/   # Should show app.test.js (Jest tests)
ls -la client/src/tests/   # Should show component/hook tests (Vitest)
cat Dockerfile             # Verify existing backend Dockerfile
```

No need to create new folders — all required files already exist.

---

## 7. Step 4 — Review the Dockerfile

The existing `Dockerfile` at the repo root is already configured for the backend. Here's what it contains (verify it matches):

```dockerfile
# ─────────────────────────────────────────────────────────────
# Stage 1: Build
# Installs all deps, builds frontend for static serving
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy server and client package files
COPY server/package*.json ./
COPY client/package*.json ./client/

# Install all dependencies
RUN npm ci --prefix server/ && \
    npm ci --prefix client/

# Copy source code
COPY server/ ./server/
COPY client/ ./client/

# Build frontend (Vite) and copy to server/public for serving
RUN cd client && npm run build && \
    mkdir -p server/public && \
    cp -r client/dist/* server/public/

# ─────────────────────────────────────────────────────────────
# Stage 2: Runtime
# Lean production image — no dev tools, non-root user
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Create non-root user
RUN addgroup -S artisan && \
    adduser -S artisan -G artisan

WORKDIR /app

# Copy only production dependencies
COPY --from=build /app/server/package*.json ./
RUN npm ci --prefix ./ --production

# Copy built application
COPY --from=build /app/server/src ./src
COPY --from=build /app/server/public ./public

# Give non-root user ownership
RUN chown -R artisan:artisan /app

USER artisan

EXPOSE 5001

# ECS uses this healthcheck to decide when the container is ready
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5001/api/health || exit 1

CMD ["node", "src/index.js"]
```

> **Key points:**
> - No Prisma steps (project uses in-memory data)
> - Copies built frontend to `server/public` for unified serving
> - Runs as non-root `artisan` user (UID 1001)
> - Healthcheck uses `/api/health` endpoint on port 5001

---

## 8. Step 5 — Review Terraform Files

All Terraform files already exist in the `terraform/` directory at the repo root. Verify their contents:

### `terraform/variables.tf`
```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "artisan-hub"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}
```

### `terraform/main.tf` (key resources)
```hcl
locals {
  resource_prefix = "${var.project_name}-${var.environment}"
}

# S3 — unique name, versioning, encryption, no public access
resource "aws_s3_bucket" "artifacts" {
  bucket        = "${local.resource_prefix}-artifacts-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "artifacts_versioning" {
  bucket = aws_s3_bucket.artifacts.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts_encryption" {
  bucket = aws_s3_bucket.artifacts.id
  rule { apply_server_side_encryption_by_default { sse_algorithm = "AES256" } }
}

resource "aws_s3_bucket_public_access_block" "artifacts_public_block" {
  bucket                  = aws_s3_bucket.artifacts.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ECR
resource "aws_ecr_repository" "backend" {
  name                 = "${local.resource_prefix}-backend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration { scan_on_push = true }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${local.resource_prefix}-cluster"
  setting { name = "containerInsights", value = "enabled" }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${local.resource_prefix}"
  retention_in_days = 7
}

# Security Group
resource "aws_security_group" "ecs" {
  name        = "${local.resource_prefix}-ecs-sg"
  description = "Allow traffic to ECS tasks"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "App port"
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "${local.resource_prefix}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_execution_role_arn

  container_definitions = jsonencode([{
    name      = "artisan-hub-server"
    image     = var.container_image
    essential = true
    portMappings = [{ containerPort = 5001, hostPort = 5001, protocol = "tcp" }]
    environment = [{ name = "PORT", value = "5001" }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/${local.resource_prefix}"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
    healthCheck = {
      command     = ["CMD-SHELL", "wget -qO- http://localhost:5001/api/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 20
    }
  }])
}

# ECS Service
resource "aws_ecs_service" "backend" {
  name            = "${local.resource_prefix}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }
}
```

> **Note:** No `DATABASE_URL` environment variable — this project uses in-memory data, no database required.

---

## 9. Step 6 — Write Verification Scripts

Create `scripts/verify-ecs.sh` (if not already present):

```bash
#!/bin/bash
# Waits for the ECS service to become stable and prints status.
# Required env vars: AWS_REGION, ECS_CLUSTER_NAME, ECS_SERVICE_NAME

set -e

AWS_REGION="${AWS_REGION:-us-east-1}"

if [ -z "$ECS_CLUSTER_NAME" ] || [ -z "$ECS_SERVICE_NAME" ]; then
  echo "Error: ECS_CLUSTER_NAME and ECS_SERVICE_NAME must be set."
  exit 1
fi

echo "Waiting for ECS service to become stable..."
aws ecs wait services-stable \
  --cluster "$ECS_CLUSTER_NAME" \
  --services "$ECS_SERVICE_NAME" \
  --region "$AWS_REGION"

echo "Fetching final ECS service state..."
aws ecs describe-services \
  --cluster "$ECS_CLUSTER_NAME" \
  --services "$ECS_SERVICE_NAME" \
  --region "$AWS_REGION" \
  --output table \
  --query 'services[0].{desiredCount:desiredCount,pendingCount:pendingCount,runningCount:runningCount,status:status,taskDefinition:taskDefinition}'

echo "ECS verification complete."
```

```bash
mkdir -p scripts
chmod +x scripts/verify-ecs.sh
```

---

## 10. Step 7 — Write the Cleanup Script

Create `scripts/clean.sh` to destroy all AWS resources:

```bash
#!/bin/bash
# Destroys all AWS resources created by the ArtisanHub pipeline.
# Run this before re-triggering the pipeline to avoid "already exists" errors.
# Usage: bash scripts/clean.sh

set -e

REGION="${AWS_REGION:-us-east-1}"
TF_DIR="$(cd "$(dirname "$0")/../terraform" && pwd)"

echo "=========================================="
echo "  ArtisanHub — Cleanup"
echo "  Region: $REGION"
echo "=========================================="

# 1. Scale ECS services to 0
echo ""
echo "→ Stopping ECS services..."
CLUSTERS=$(aws ecs list-clusters --region "$REGION" \
  --query 'clusterArns[]' --output text 2>/dev/null || echo "")

for CLUSTER_ARN in $CLUSTERS; do
  CLUSTER_NAME=$(basename "$CLUSTER_ARN")
  if [[ "$CLUSTER_NAME" == *"artisan-hub"* ]]; then
    SERVICES=$(aws ecs list-services --cluster "$CLUSTER_NAME" \
      --region "$REGION" --query 'serviceArns[]' --output text 2>/dev/null || echo "")
    for SERVICE_ARN in $SERVICES; do
      SERVICE_NAME=$(basename "$SERVICE_ARN")
      echo "  Scaling down: $SERVICE_NAME"
      aws ecs update-service --cluster "$CLUSTER_NAME" --service "$SERVICE_NAME" \
        --desired-count 0 --region "$REGION" > /dev/null 2>&1 || true
    done
  fi
done
sleep 15

# 2. Empty S3 buckets
echo ""
echo "→ Emptying S3 buckets..."
BUCKETS=$(aws s3api list-buckets \
  --query 'Buckets[?starts_with(Name, `artisan-hub`)].Name' \
  --output text 2>/dev/null || echo "")

for BUCKET in $BUCKETS; do
  if [ -n "$BUCKET" ] && [ "$BUCKET" != "None" ]; then
    echo "  Emptying: $BUCKET"
    aws s3 rm "s3://$BUCKET" --recursive --region "$REGION" > /dev/null 2>&1 || true
  fi
done

# 3. Terraform destroy
echo ""
echo "→ Running terraform destroy..."
if [ -f "$TF_DIR/terraform.tfstate" ]; then
  cd "$TF_DIR"
  terraform init -reconfigure > /dev/null 2>&1
  terraform destroy -auto-approve -var="aws_region=$REGION" || echo "⚠️  Some resources may need manual cleanup."
else
  echo "  No local terraform.tfstate found — skipping terraform destroy."
fi

# 4. Force-delete remaining ECR repos
echo ""
echo "→ Cleaning up ECR repositories..."
REPOS=$(aws ecr describe-repositories --region "$REGION" \
  --query 'repositories[?starts_with(repositoryName, `artisan-hub`)].repositoryName' \
  --output text 2>/dev/null || echo "")
for REPO in $REPOS; do
  if [ -n "$REPO" ] && [ "$REPO" != "None" ]; then
    echo "  Deleting: $REPO"
    aws ecr delete-repository --repository-name "$REPO" --force \
      --region "$REGION" > /dev/null 2>&1 || true
  fi
done

# 5. Delete CloudWatch log groups
echo ""
echo "→ Cleaning up CloudWatch log groups..."
LOG_GROUPS=$(aws logs describe-log-groups \
  --log-group-name-prefix "/ecs/artisan-hub" --region "$REGION" \
  --query 'logGroups[].logGroupName' --output text 2>/dev/null || echo "")
for LG in $LOG_GROUPS; do
  if [ -n "$LG" ] && [ "$LG" != "None" ]; then
    echo "  Deleting: $LG"
    aws logs delete-log-group --log-group-name "$LG" \
      --region "$REGION" > /dev/null 2>&1 || true
  fi
done

echo ""
echo "=========================================="
echo "✅ Cleanup complete!"
echo "=========================================="
```

```bash
chmod +x scripts/clean.sh
```

---

## 11. Step 8 — Review the GitHub Actions Pipeline

The existing pipeline is at `.github/workflows/deploy.yml` (4 phases). Review its key steps:

### Phase 1 — Tests
- Runs Jest tests: `cd server && npm test`
- Runs Vitest tests: `cd client && npm test`
- Runs ESLint and Vite build for frontend
- Uploads JUnit test reports

### Phase 2 — Terraform
- Uses existing `terraform/` directory
- Runs `terraform init`, `validate`, `plan`, `apply`
- Outputs ECR URL, ECS cluster/service names

### Phase 3 — Docker Build
- Builds backend Docker image with `--platform linux/amd64`
- Pushes to ECR repository `artisan-hub-backend`

### Phase 4 — Deploy
- Deploys to ECS Fargate using existing task definition
- Waits for service to stabilize
- Verifies health endpoint

No need to create a new pipeline — update the existing `deploy.yml` if changes are needed.

---

## 12. Step 9 — Test Everything Locally First

Always test locally before pushing. This saves you from discovering obvious mistakes after a pipeline run.

### 12a. Configure AWS CLI (if not done already)

```bash
aws configure set aws_access_key_id     YOUR_KEY
aws configure set aws_secret_access_key YOUR_SECRET
aws configure set aws_session_token     YOUR_TOKEN
aws configure set default.region        us-east-1

aws sts get-caller-identity    # should print your account ID
```

### 12b. Initialize and apply Terraform (infrastructure only)

```bash
cd terraform

terraform init
# Expected: "Terraform has been successfully initialized!"

terraform validate
# Expected: "Success! The configuration is valid."

terraform plan
# Read through. Should show ~8 resources to create.

terraform apply
# Type: yes
```

When complete, you'll see outputs:

```
ecr_repository_url = "443325993463.dkr.ecr.us-east-1.amazonaws.com/artisan-hub-backend"
ecs_cluster_name   = "artisan-hub-production-cluster"
s3_bucket_name     = "artisan-hub-production-artifacts-443325993463"
```

Save the `ecr_repository_url` — you need it next.

### 12c. Build and push Docker image

Go back to the **root of the repo**:

```bash
cd /path/to/Devops-Project   # repo root — important!

ECR_URL="443325993463.dkr.ecr.us-east-1.amazonaws.com/artisan-hub-backend"
# ↑ replace with your actual ECR URL from terraform output

# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_URL

# Build — MUST include --platform linux/amd64 (especially on Mac M1/M2/M3)
docker build \
  --platform linux/amd64 \
  -t artisan-hub:latest \
  .

# Tag and push
docker tag artisan-hub:latest $ECR_URL:latest
docker push $ECR_URL:latest
```

### 12d. Deploy ECS service

```bash
cd terraform

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

terraform apply \
  -var="container_image=${ECR_URL}:latest" \
  -var="ecs_execution_role_arn=arn:aws:iam::${ACCOUNT_ID}:role/LabRole"
# Type: yes
```

### 12e. Get the public IP and test

```bash
CLUSTER="artisan-hub-production-cluster"   # from terraform output
SERVICE="artisan-hub-production-service"   # from terraform output

TASK_ARN=$(aws ecs list-tasks \
  --cluster $CLUSTER --service-name $SERVICE \
  --region us-east-1 --query 'taskArns[0]' --output text)

ENI_ID=$(aws ecs describe-tasks \
  --cluster $CLUSTER --tasks $TASK_ARN --region us-east-1 \
  --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
  --output text)

PUBLIC_IP=$(aws ec2 describe-network-interfaces \
  --network-interface-ids $ENI_ID --region us-east-1 \
  --query 'NetworkInterfaces[0].Association.PublicIp' --output text)

echo "Public IP: $PUBLIC_IP"
sleep 30   # wait for container to fully start
curl http://$PUBLIC_IP:5001/api/health
```

Expected response:

```json
{"status":"ok","message":"ArtisanHub backend is running","timestamp":"2026-05-04T10:30:00.000Z"}
```

If you see that — local deployment works. Now clean up before pushing to GitHub.

```bash
bash scripts/clean.sh
```

---

## 13. Step 10 — Verify on AWS Console

After running Terraform locally (or after the pipeline runs), verify every resource on the AWS Console. Here's exactly what to click and what to look for.

### Access the AWS Console

1. AWS Academy → Learner Lab → click the **AWS** button (top left, next to the green dot)
2. Confirm the region selector (top right of AWS Console) shows **US East (N. Virginia) us-east-1**

---

### Check S3 — Bucket with versioning, encryption, no public access

1. Type **S3** in the AWS Console search bar → click **S3**
2. Look for a bucket named `artisan-hub-production-artifacts-{account_id}`
3. Click the bucket name
4. Click **Properties** tab:
   - Scroll to **Bucket Versioning** → should say ✅ `Enabled`
   - Scroll to **Default encryption** → should say ✅ `Amazon S3 managed keys (SSE-S3)`
5. Click **Permissions** tab:
   - **Block public access** → all four checkboxes should be ✅ `On`

What you want to see:
```
Bucket name:   artisan-hub-production-artifacts-443325993463
Versioning:    Enabled
Encryption:    SSE-S3 (AES-256)
Public access: Block all (4 settings ON)
```

---

### Check ECR — Repository with your image

1. Search **ECR** → click **Elastic Container Registry**
2. Click **Repositories** (left sidebar)
3. Find `artisan-hub-backend` → click it
4. You should see an image with tag **`latest`**
5. Click the image to see details:
   - **OS/Arch:** `linux/amd64` (confirms platform flag worked)
   - **Pushed at:** a few minutes ago
   - **Scan status:** Complete (findings are normal — not a problem)

What you want to see:
```
Repository:  artisan-hub-backend
Image tag:   latest
OS/Arch:     linux/amd64
```

---

### Check ECS — Cluster, service, running task

1. Search **ECS** → click **Elastic Container Service**
2. Click **Clusters** (left sidebar)
3. Find `artisan-hub-production-cluster` → click it
4. Click the **Services** tab:
   - Find `artisan-hub-production-service`
   - Check: **Desired tasks: 1**, **Running tasks: 1**, **Status: ACTIVE**
5. Click the service name
6. Click the **Tasks** tab → click the task ID
7. Under **Configuration** you'll see the **Public IP**
8. Under **Containers** → expand the container → click **View logs** to jump straight to CloudWatch

What you want to see:
```
Cluster:       artisan-hub-production-cluster
Service:       artisan-hub-production-service
Status:        ACTIVE
Desired:       1
Running:       1
```

---

### Check CloudWatch Logs — Container output

1. Search **CloudWatch** → click **CloudWatch**
2. Click **Log groups** (left sidebar)
3. Find `/ecs/artisan-hub-production`
4. Click it → click the latest log stream (named `ecs/artisan-hub-server/...`)
5. Look for:
   ```
   Server running on port 5001
   ```

---

### Hit the health endpoint

```bash
curl http://<YOUR_PUBLIC_IP>:5001/api/health
```

Or paste `http://<YOUR_PUBLIC_IP>:5001/api/health` into your browser.

Expected:
```json
{"status":"ok","message":"ArtisanHub backend is running","timestamp":"..."}
```

---

## 14. Step 11 — Push to GitHub and Trigger Pipeline

### Commit any changes (if needed)

```bash
# From root of your repo
git add terraform/ Dockerfile .github/workflows/deploy.yml scripts/
git status
# Confirm you see all modified files listed

git commit -m "feat: update infrastructure for ArtisanHub ECS deployment"
git push origin main
```

### Trigger the existing pipeline

1. Go to your GitHub repo in the browser
2. Click the **Actions** tab (top of repo)
3. In the left sidebar, find **"Deploy"** (the existing pipeline)
4. Click **"Run workflow"** button (right side of the page)
5. Leave branch as `main`
6. Click the green **"Run workflow"** button

The run appears in the list. Click on it to watch in real time.

**What you'll see:**

The pipeline runs 4 jobs in sequence. Each one must pass before the next starts.

| Job | Duration | Status means |
|-----|----------|-------------|
| Phase 1 — Tests | ~3 min | Server + client tests passed, reports uploaded |
| Phase 2 — Terraform | ~3 min | AWS resources created |
| Phase 3 — Docker Build | ~4 min | Image built and pushed to ECR |
| Phase 4 — Deploy | ~5 min | ECS service running, health checked |

All green = success. Click any job to see individual step logs.

---

## 15. Step 12 — Verify Pipeline on AWS Console

After all pipeline jobs show green checkmarks, do the same console verification from Step 10:

1. **S3** → bucket exists with versioning + encryption + blocked public access
2. **ECR** → repository exists with `latest` image tagged `linux/amd64`
3. **ECS** → cluster + service + 1 running task
4. **CloudWatch** → log group exists with `Server running on port 5001` in logs
5. **Health endpoint** → curl returns `{"status":"ok","message":"ArtisanHub backend is running",...}`

---

## 16. Cleanup

### After local testing:

```bash
bash scripts/clean.sh
```

### After GitHub Actions pipeline:

The pipeline doesn't auto-destroy. You have to clean up manually.

Run `clean.sh` — but note: it only destroys resources tracked by **local** Terraform state. Since the pipeline ran on GitHub's servers, there's no local state file. The script will still clean up via AWS CLI (ECR, ECS, S3, CloudWatch) by prefix `artisan-hub-`.

```bash
bash scripts/clean.sh
```

Or go to the AWS Console and manually delete:
1. ECS → Service → delete (set desired count to 0 first)
2. ECS → Cluster → delete
3. ECR → Repository → delete
4. S3 → Bucket → empty then delete
5. CloudWatch → Log group → delete
6. EC2 → Security groups → delete the `artisan-hub-*` one

> Always clean up before running the pipeline again. Each run creates new resources with new random suffixes.

---

## 17. Troubleshooting

### `exec format error` in CloudWatch logs

```
exec /usr/local/bin/docker-entrypoint.sh: exec format error
```

**Cause:** Image built for ARM64 (Mac M1/M2/M3), ECS needs AMD64.

**Fix:** Add `--platform linux/amd64` to the build command:

```bash
docker build --platform linux/amd64 -t artisan-hub:latest .
```

---

### `curl: (28) Failed to connect` — port 5001 timeout

**Diagnose first:**

```bash
aws logs tail /ecs/artisan-hub-production --follow --region us-east-1
```

Then:
1. If logs show errors → fix the error (check container logs)
2. If logs show `Server running on port 5001` → wait longer, the container just started
3. If no log stream exists → task never started; check ECS service events in console

---

### GitHub Actions fails with `ExpiredTokenException`

**Cause:** AWS Academy tokens expire when the lab session ends.

**Fix:**
1. AWS Academy → Start Lab → AWS Details → copy fresh credentials
2. GitHub → Settings → Secrets → Actions → update:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SESSION_TOKEN`
3. Re-trigger the pipeline

---

### Terraform fails with `AlreadyExistsException` or `already exists`

**Cause:** Previous run left resources. Local state and pipeline state are separate files.

**Fix:**

```bash
bash scripts/clean.sh
```

---

### `InvalidParameterException: taskId length should be one of [32,36]`

**Cause:** Ran IP lookup before the new task started — `list-tasks` returned empty string.

**Fix:** Wait 30-60 seconds and retry:

```bash
aws ecs list-tasks \
  --cluster artisan-hub-production-cluster \
  --service-name artisan-hub-production-service \
  --region us-east-1
```

Once a taskArn appears, run the IP lookup.

---

## 18. What If Your Repo Is Different?

This guide is for ArtisanHub where:
- Backend: `server/` folder with own `package.json`
- No database (in-memory data, no Prisma)
- Entry point: `server/src/index.js`
- Port: `5001`
- Health endpoint: `/api/health` (returns "ArtisanHub backend is running")
- Tests: Jest (server) + Vitest (client)
- Existing infrastructure: `terraform/` at root, `Dockerfile` at root

If your repo has a different structure, change these specific things:

| Your repo difference | What to change |
|---------------------|---------------|
| Uses Prisma / database | Add Prisma generate, db push, seed steps back to Dockerfile and pipeline |
| Backend in different folder | Update `WORKDIR` and `COPY` paths in Dockerfile |
| Different port (e.g. 3000) | Change `EXPOSE 5001` → `EXPOSE 3000`, update security group ports in `main.tf`, update healthcheck URL |
| Different health endpoint | Change `/api/health` in `HEALTHCHECK` and `main.tf` healthCheck command |
| Different entry point | Change `CMD ["node", "src/index.js"]` to your actual entry point |
| Different test framework | Update Phase 1 test commands in the pipeline |
| No frontend to bundle | Remove the frontend build steps from the Dockerfile |
| Different AWS resource names | Update the `project_name` variable in `terraform/variables.tf` |

**Quick self-check prompts — answer these about your own repo before modifying files:**

1. What folder is my backend in?
2. What command starts my server? (`node src/index.js`? `npm start`? something else?)
3. What port does it listen on?
4. Is there a health check endpoint? What's the path?
5. Where is my `package.json`?
6. Do I use a database? (Prisma? PostgreSQL? MongoDB? None?)
7. How do I run tests? (`npm test`? `cd server && npm test`?)