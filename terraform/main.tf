provider "aws" {
  region = "eu-west-1"
}

# Security Group
resource "aws_security_group" "tarot_sg" {
  name        = "tarot_app_sg"
  description = "Allow app ports"

  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Get latest Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# EC2 instance
resource "aws_instance" "tarot_ec2" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name
  security_groups = [aws_security_group.tarot_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              apt update
              apt install -y docker.io docker-compose git
              systemctl enable docker
              systemctl start docker
              cd /home/ubuntu
              git clone ${var.repo_url} app
              cd app
              docker-compose up -d
              EOF

  tags = {
    Name = "tarot-app"
  }
}
