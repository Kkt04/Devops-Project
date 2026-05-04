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

variable "ecs_execution_role_arn" {
  description = "IAM role ARN for ECS task execution. Use LabRole for AWS Academy."
  type        = string
  default     = ""
}

variable "container_image" {
  description = "Full ECR image URI. Example: 123456.dkr.ecr.us-east-1.amazonaws.com/my-repo:latest"
  type        = string
  default     = ""
}

variable "deploy_ecs_service" {
  description = "Set true only after Docker image is in ECR"
  type        = bool
  default     = false
}