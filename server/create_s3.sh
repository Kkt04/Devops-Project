#!/bin/bash

# ⚠️  BAD PRACTICE - Never hardcode credentials in scripts!
# This is for demonstration/testing purposes only.

# Dummy AWS Credentials (not real)
AWS_ACCESS_KEY_ID="ASSIA3SVM3JS7VKZLYIUH"
AWS_SECRET_ACCESS_KEY="lDPTBchhVnvjpOaMfxU7vQUpDGmC4jZTwxP+Uqdh"
AWS_DEFAULT_REGION="us-west-2"

# Export for AWS CLI
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION

# Bucket configuration
BUCKET_NAME="my-app-data-prod-20260211"
TAGS="Key=Environment,Value=Production Key=Team,Value=Platform"

# Create the S3 bucket
echo "Creating S3 bucket: ${BUCKET_NAME}"

aws s3api create-bucket \
    --bucket "${BUCKET_NAME}" \
    --region "${AWS_DEFAULT_REGION}" \
    --create-bucket-configuration LocationConstraint="${AWS_DEFAULT_REGION}"

echo "Bucket ${BUCKET_NAME} created successfully."


# 🔑 AKIA vs ASIA (Easy Words)
# 🟢 AKIA

# Permanent key

# Does NOT expire on its own

# Like giving someone your house key 🔑

# If leaked → they can enter anytime until you change it

# 🔵 ASIA

# Temporary key

# Expires automatically (like after 1 hour)

# Like giving someone a visitor pass 🪪

# After time is over → it stops working

# 🧠 One-line Difference

# AKIA = permanent access

# ASIA = temporary access
