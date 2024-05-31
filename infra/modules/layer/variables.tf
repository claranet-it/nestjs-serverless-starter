variable "name" {
  description = "Layer name"
  type        = string
}

variable "description" {
  description = "Layer description"
  type        = string
}

variable "tags" {
  description = "Tags"
  type        = map(string)
}
