# Main outputs
output "application_url" {
  value       = "http://${aws_lb.main.dns_name}"
  description = "URL pública para acceder a la aplicación"
}

output "api_docs_url" {
  value       = "http://${aws_lb.main.dns_name}/docs"
  description = "URL para acceder a Swagger UI"
}

output "database_endpoint" {
  value       = aws_db_instance.mysql.endpoint
  description = "Endpoint de RDS para conexiones"
}

output "database_address" {
  value       = aws_db_instance.mysql.address
  description = "Dirección/IP del database"
  sensitive   = false
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.backend.repository_url
  description = "URL del repositorio ECR para push de imágenes"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.backend_bucket.id
  description = "Nombre del bucket S3 para almacenamiento"
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "Nombre del cluster ECS"
}

output "ecs_service_name" {
  value       = aws_ecs_service.backend_service.name
  description = "Nombre del servicio ECS"
}

output "deploy_credentials" {
  value = {
    access_key_id     = aws_iam_access_key.backend_deploy.id
    secret_access_key = aws_iam_access_key.backend_deploy.secret
  }
  description = "Credenciales para CI/CD (guardar en secretos)"
  sensitive   = true
}

# Información de seguridad
output "security_groups" {
  value = {
    alb = aws_security_group.alb.id
    ecs = aws_security_group.ecs_sg.id
    rds = aws_security_group.rds_sg.id
  }
  description = "Security Groups creados"
}

output "vpc_id" {
  value       = aws_vpc.main.id
  description = "ID de la VPC"
}

output "subnets" {
  value = {
    public1  = aws_subnet.public1.id
    public2  = aws_subnet.public2.id
    private1 = aws_subnet.private1.id
    private2 = aws_subnet.private2.id
  }
  description = "IDs de los subnets"
}

output "rds_security_group_id" {
  value = aws_security_group.rds_sg.id
}

output "db_subnet_group_name" {
  value = aws_db_subnet_group.default.name
}
