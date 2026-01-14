variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
}

variable "container_port" {
  description = "Puerto expuesto por el contenedor"
  type        = number
}

variable "db_username" {
  description = "Usuario para la base de datos RDS"
  type        = string
}

variable "db_password" {
  description = "Password para la base de datos RDS"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Nombre de la base de datos RDS"
  type        = string
}

variable "ssh_allowed_ip" {
  description = "IP permitida para SSH (usado en Security Group)"
  type        = string
}

variable "key_name" {
  description = "Nombre del key pair para EC2 (opcional si usas EC2)"
  type        = string
}

variable "aws_region" {
  description = "La región de AWS donde se desplegarán los recursos"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block para la VPC"
  type        = string
}

variable "public_subnet_cidr" {
  description = "CIDR block para el subnet público"
  type        = string
}

