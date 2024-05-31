locals {
  app = {
    name        = "nestjs-sls-starter-${var.stage}"
    description = "NestJs Serverless Starter application"
  }

  lambda = {
    main = {
      handler    = "lambda.handler"
      source_dir = "../../../dist"
    }
  }

  layer = {
    dependencies = {
      name        = "nestjs-sls-starter-${var.stage}-dependencies"
      description = "NestJs Serverless Starter Dependencies Layer"
      build_dir   = "../../build/layers"
    }
  }

  tags = {
    Owner   = "Massimo Biagioli"
    Destroy = "false"
  }
}