output "ec2_public_ip" {
  value = aws_instance.tarot_ec2.public_ip
}

output "ec2_public_dns" {
  value = aws_instance.tarot_ec2.public_dns
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "http://${aws_instance.tarot_ec2.public_ip}:5173"
}