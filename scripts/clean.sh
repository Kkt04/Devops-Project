#!/bin/bash
# Destroys all AWS resources created by the ArtisanHub pipeline.
# Run this before re-triggering the pipeline to avoid "already exists" errors.
# Usage: bash scripts/clean.sh

set -e

REGION="${AWS_REGION:-us-east-1}"

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

# 2. Delete ECS services
echo ""
echo "→ Deleting ECS services..."
for CLUSTER_ARN in $CLUSTERS; do
  CLUSTER_NAME=$(basename "$CLUSTER_ARN")
  if [[ "$CLUSTER_NAME" == *"artisan-hub"* ]]; then
    SERVICES=$(aws ecs list-services --cluster "$CLUSTER_NAME" \
      --region "$REGION" --query 'serviceArns[]' --output text 2>/dev/null || echo "")
    for SERVICE_ARN in $SERVICES; do
      SERVICE_NAME=$(basename "$SERVICE_ARN")
      echo "  Deleting service: $SERVICE_NAME"
      aws ecs delete-service --cluster "$CLUSTER_NAME" --service "$SERVICE_NAME" \
        --region "$REGION" > /dev/null 2>&1 || true
    done
  fi
done
sleep 15

# 3. Delete ECS clusters
echo ""
echo "→ Deleting ECS clusters..."
for CLUSTER_ARN in $CLUSTERS; do
  CLUSTER_NAME=$(basename "$CLUSTER_ARN")
  if [[ "$CLUSTER_NAME" == *"artisan-hub"* ]]; then
    echo "  Deleting cluster: $CLUSTER_NAME"
    aws ecs delete-cluster --cluster "$CLUSTER_NAME" --region "$REGION" > /dev/null 2>&1 || true
  fi
done
sleep 5

# 4. Delete ECR repositories
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

# 5. Empty and delete S3 buckets (preserve Terraform state bucket)
echo ""
echo "→ Emptying S3 buckets..."
BUCKETS=$(aws s3api list-buckets \
  --query 'Buckets[?starts_with(Name, `artisan-hub`)].Name' \
  --output text 2>/dev/null || echo "")
TF_STATE_BUCKET="artisan-hub-production-artifacts-896673846525"

for BUCKET in $BUCKETS; do
  if [ -n "$BUCKET" ] && [ "$BUCKET" != "None" ]; then
    if [ "$BUCKET" = "$TF_STATE_BUCKET" ]; then
      echo "  Skipping Terraform state bucket: $BUCKET"
      continue
    fi
    echo "  Emptying: $BUCKET"
    aws s3 rm "s3://$BUCKET" --recursive --region "$REGION" > /dev/null 2>&1 || true
    echo "  Deleting: $BUCKET"
    aws s3 rb "s3://$BUCKET" --force --region "$REGION" > /dev/null 2>&1 || true
  fi
done

# 6. Delete CloudWatch log groups
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

# 7. Delete Security Groups
echo ""
echo "→ Cleaning up Security Groups..."
SG_IDS=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=*artisan-hub*" \
  --region "$REGION" \
  --query 'SecurityGroups[].GroupId' --output text 2>/dev/null || echo "")
for SG_ID in $SG_IDS; do
  if [ -n "$SG_ID" ] && [ "$SG_ID" != "None" ]; then
    echo "  Deleting: $SG_ID"
    aws ec2 delete-security-group --group-id "$SG_ID" \
      --region "$REGION" > /dev/null 2>&1 || true
  fi
done

# 8. Terraform destroy (if local state exists)
echo ""
echo "→ Running terraform destroy..."
TF_DIR="$(cd "$(dirname "$0")/../terraform" && pwd)"
if [ -f "$TF_DIR/terraform.tfstate" ]; then
  cd "$TF_DIR"
  terraform init -reconfigure > /dev/null 2>&1
  terraform destroy -auto-approve -var="aws_region=$REGION" || echo "⚠️  Some resources may need manual cleanup."
else
  echo "  No local terraform.tfstate found — skipping terraform destroy."
fi

echo ""
echo "=========================================="
echo "✅ Cleanup complete!"
echo "=========================================="
