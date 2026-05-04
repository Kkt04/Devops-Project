# ─────────────────────────────────────────────────────────────
# Data Sources
# ─────────────────────────────────────────────────────────────
data "aws_caller_identity" "current" {}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# ─────────────────────────────────────────────────────────────
# Locals
# ─────────────────────────────────────────────────────────────
locals {
  resource_prefix = "${var.project_name}-${var.environment}"

  create_ecs_service = (
    var.deploy_ecs_service &&
    var.container_image != "" &&
    var.ecs_execution_role_arn != ""
  )
}

# ─────────────────────────────────────────────────────────────
# S3 Bucket — unique name, versioning, encryption, no public access
# ─────────────────────────────────────────────────────────────
resource "aws_s3_bucket" "artifacts" {
  bucket        = "${local.resource_prefix}-artifacts-${data.aws_caller_identity.current.account_id}"
  force_destroy = true

  tags = {
    Name      = "${local.resource_prefix}-artifacts"
    ManagedBy = "terraform"
  }
}

resource "aws_s3_bucket_versioning" "artifacts_versioning" {
  bucket = aws_s3_bucket.artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts_encryption" {
  bucket = aws_s3_bucket.artifacts.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "artifacts_public_block" {
  bucket                  = aws_s3_bucket.artifacts.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ─────────────────────────────────────────────────────────────
# ECR Repository
# ─────────────────────────────────────────────────────────────
resource "aws_ecr_repository" "backend" {
  name                 = "${local.resource_prefix}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name      = "${local.resource_prefix}-backend"
    ManagedBy = "terraform"
  }
}

# ─────────────────────────────────────────────────────────────
# ECS Cluster
# ─────────────────────────────────────────────────────────────
resource "aws_ecs_cluster" "main" {
  name = "${local.resource_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name      = "${local.resource_prefix}-cluster"
    ManagedBy = "terraform"
  }
}

# ─────────────────────────────────────────────────────────────
# CloudWatch Log Group
# ─────────────────────────────────────────────────────────────
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${local.resource_prefix}"
  retention_in_days = 7

  tags = {
    Name      = "/ecs/${local.resource_prefix}"
    ManagedBy = "terraform"
  }
}

# ─────────────────────────────────────────────────────────────
# Security Group
# ─────────────────────────────────────────────────────────────
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

  tags = {
    Name      = "${local.resource_prefix}-ecs-sg"
    ManagedBy = "terraform"
  }
}

# ─────────────────────────────────────────────────────────────
# ECS Task Definition (conditional — only when deploy_ecs_service=true)
# ─────────────────────────────────────────────────────────────
resource "aws_ecs_task_definition" "backend" {
  count                    = local.create_ecs_service ? 1 : 0
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
    portMappings = [{
      containerPort = 5001
      hostPort      = 5001
      protocol      = "tcp"
    }]
    environment = [{
      name  = "PORT"
      value = "5001"
    }]
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

  tags = {
    Name      = "${local.resource_prefix}-task"
    ManagedBy = "terraform"
  }
}

# ─────────────────────────────────────────────────────────────
# ECS Service (conditional — only when deploy_ecs_service=true)
# ─────────────────────────────────────────────────────────────
resource "aws_ecs_service" "backend" {
  count           = local.create_ecs_service ? 1 : 0
  name            = "${local.resource_prefix}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend[0].arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  tags = {
    Name      = "${local.resource_prefix}-service"
    ManagedBy = "terraform"
  }
}
