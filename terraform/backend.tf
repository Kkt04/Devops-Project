terraform {
  backend "s3" {
    bucket  = "artisan-hub-production-artifacts-896673846525"
    key     = "terraform/production/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
