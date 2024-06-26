provider "aws" {
  region = var.region
}

terraform {
  required_providers {
    aws = {
      version = ">= 5.5.0"
      source  = "hashicorp/aws"
    }
  }

  required_version = "~> 1.0"

  backend "s3" {
    bucket         = "nestjs-sls-starter-dev-tfstate"
    key            = "nestjs-sls-starter-dev/terraform.tfstate"
    dynamodb_table = "nestjs-sls-starter-dev-tfstate-locks"
    region         = "eu-west-1"
    encrypt        = true
  }
}
