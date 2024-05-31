variable "app_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "app_description" {
  description = "The description of the Lambda function"
  type        = string
}

variable "stage" {
  description = "Stage name (dev, staging, prod)"
  type        = string
}

variable "lambda_uri" {
  description = "The URI of the Lambda function"
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the Lambda function"
  type        = map(string)
}