# DB Subnet Group
resource "aws_db_subnet_group" "default" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [aws_subnet.private1.id, aws_subnet.private2.id]

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-db-subnet-group" }
  )
}

# Security Group para RDS
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group para RDS MySQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_sg.id]
    description     = "MySQL from ECS tasks"
  }

  ingress {
    description = "MySQL from personal PC"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_ip]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-rds-sg" }
  )
}

resource "aws_db_instance" "mysql" {
  identifier           = "${var.project_name}-mysql"
  allocated_storage    = 20
  storage_type         = "gp3"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"

  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password

  parameter_group_name = "default.mysql8.0"
  db_subnet_group_name = aws_db_subnet_group.default.name

  publicly_accessible     = false

  # 💸 COSTO CERO
  multi_az                = false
  backup_retention_period = 0
  skip_final_snapshot     = true

  performance_insights_enabled = false

  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-rds" }
  )

  depends_on = [aws_db_subnet_group.default]
}
