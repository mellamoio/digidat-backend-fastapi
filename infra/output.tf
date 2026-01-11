output "backend_url" {
  description = "URL para acceder al backend"
  value       = aws_lb.alb.dns_name
}
output "db_endpoint" {
  description = "Endpoint de la base de datos RDS"
  value       = aws_db_instance.mysql.address
}

output "backend_access_key_id" {
  value     = aws_iam_access_key.backend_access_key.id
  sensitive = true
}

output "backend_secret_access_key" {
  value     = aws_iam_access_key.backend_access_key.secret
  sensitive = true
}

output "backend_ecr_url" {
  value = aws_ecr_repository.backend.repository_url
}
