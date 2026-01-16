variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "digidat"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "container_port" {
  description = "Puerto expuesto por el contenedor"
  type        = number
  default     = 8000
}

variable "db_username" {
  description = "Usuario para la base de datos RDS"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Password para la base de datos RDS"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Nombre de la base de datos RDS"
  type        = string
  default     = "digidat"
}

variable "db_allocated_storage" {
  description = "Storage asignado en GB para RDS"
  type        = number
  default     = 20
}

variable "db_backup_retention_period" {
  description = "Días de retención de backups"
  type        = number
  default     = 0
}

variable "ssh_allowed_ip" {
  description = "IP permitida para acceso a BD desde tu PC (formato: x.x.x.x/32)"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "Región de AWS donde desplegar"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block para la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  description = "CIDR block para subnet público 1"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  description = "CIDR block para subnet público 2"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_1_cidr" {
  description = "CIDR block para subnet privado 1 (RDS)"
  type        = string
  default     = "10.0.10.0/24"
}

variable "private_subnet_2_cidr" {
  description = "CIDR block para subnet privado 2 (RDS)"
  type        = string
  default     = "10.0.11.0/24"
}

# FastAPI Variables
variable "secret_key" {
  description = "Secret key para JWT de FastAPI"
  type        = string
  sensitive   = true
}

variable "debug" {
  description = "Modo debug de FastAPI"
  type        = bool
  default     = false
}

variable "algorithm" {
  description = "Algoritmo JWT"
  type        = string
  default     = "HS256"
}

variable "access_token_expire_minutes" {
  description = "Minutos de expiración del token"
  type        = number
  default     = 1440
}

# AWS S3
variable "enable_s3_versioning" {
  description = "Habilitar versionado en S3"
  type        = bool
  default     = true
}

# ECS
variable "ecs_desired_count" {
  description = "Número de tareas ECS deseadas"
  type        = number
  default     = 2
}

variable "ecs_cpu" {
  description = "CPU para ECS Fargate (256, 512, 1024, 2048, 4096)"
  type        = string
  default     = "256"
}

variable "ecs_memory" {
  description = "Memoria para ECS Fargate (MB)"
  type        = string
  default     = "512"
}

# Tags
variable "tags" {
  description = "Tags comunes para todos los recursos"
  type        = map(string)
  default = {
    Project     = "digidat"
    ManagedBy   = "terraform"
    Environment = "aws"
  }
}

