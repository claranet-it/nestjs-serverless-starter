module "layer_dependencies" {
  source = "../../modules/layer"

  name        = local.layer.dependencies.name
  description = local.layer.dependencies.description
  tags        = local.tags
}

module "lambda" {
  source = "../../modules/lambda"

  function_name = local.app.name
  stage         = var.stage
  source_dir    = local.lambda.main.source_dir
  handler       = local.lambda.main.handler
  layers        = [module.layer_dependencies.layer_arn]
  tags          = local.tags
}

module "apigw" {
  source = "../../modules/apigw"

  app_name        = local.app.name
  app_description = local.app.description
  stage           = var.stage
  lambda_uri      = module.lambda.invoke_arn
  tags            = local.tags
}