resource "aws_lambda_function" "app" {
  filename         = local.filename
  function_name    = var.function_name
  role             = aws_iam_role.lambda_exec.arn
  handler          = var.handler
  layers           = var.layers
  runtime          = local.lambda_runtime
  timeout          = local.timeout
  source_code_hash = filebase64sha256(data.external.lambda.result.filename)

  environment {
    variables = { for kv in regexall("(.*?)=(.*)", file(local.dotenv_file)) : kv[0] => kv[1] }
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = local.log_retention
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "${var.function_name}-lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role" "lambda_exec" {
  name               = "${var.function_name}-lambda-exec"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}
