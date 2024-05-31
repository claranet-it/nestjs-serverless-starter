variable "function_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "stage" {
  description = "The name of the stage (e.g., dev, prod)"
  type        = string
}

variable "handler" {
  description = "The name of the handler function"
  type        = string
}

variable "layers" {
  description = "A list of Lambda layer ARNs"
  type        = list(string)
}

variable "source_dir" {
  description = "The directory containing the Lambda function source code"
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the Lambda function"
  type        = map(string)
}