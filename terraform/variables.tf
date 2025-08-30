variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "key_name" {
  description = "AWS key pair for SSH"
}

variable "repo_url" {
  description = "Git repository URL for your tarot app"
}
