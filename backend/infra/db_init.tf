# Upload digidat.sql to S3 and run an ECS one-off task to import it into RDS

# S3 object for the SQL file
resource "aws_s3_object" "digidat_sql" {
  bucket = aws_s3_bucket.backend_bucket.id
  key    = "digidat.sql"
  source = "${path.module}/../sql/digidat.sql"
  etag   = filemd5("${path.module}/../sql/digidat.sql")
}

# Use existing ECS task role for the DB init task to avoid creating duplicate roles
# Attach a minimal inline policy granting S3 read access for the SQL object
resource "aws_iam_role_policy" "ecs_db_init_s3_policy" {
  name = "${var.project_name}-ecs-db-init-s3-policy"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = ["s3:GetObject"],
        Resource = ["${aws_s3_bucket.backend_bucket.arn}/*"]
      }
    ]
  })
}

# Task definition to run the init (one-off)
resource "aws_ecs_task_definition" "db_init" {
  family                   = "${var.project_name}-db-init"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_execution.arn
  task_role_arn      = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "db-init",
      image     = "amazonlinux:2",
      essential = true,
      command = ["/bin/sh","-c",
        "yum install -y python3 unzip mariadb && pip3 install --no-cache-dir awscli && aws s3 cp s3://${aws_s3_bucket.backend_bucket.bucket}/digidat.sql /tmp/digidat.sql && mysql -h ${aws_db_instance.mysql.address} -P ${aws_db_instance.mysql.port} -u ${var.db_username} -p'${var.db_password}' ${var.db_name} < /tmp/digidat.sql"
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name,
          "awslogs-region"        = var.aws_region,
          "awslogs-stream-prefix" = "db-init"
        }
      }
    }
  ])
}

# Run the init task once after the SQL object changes or task definition updates
resource "null_resource" "run_db_init" {
  triggers = {
    sql_etag   = aws_s3_object.digidat_sql.etag
    task_arn    = aws_ecs_task_definition.db_init.arn
  }


    provisioner "local-exec" {
    interpreter = ["PowerShell", "-Command"]
    command = <<EOT
    aws ecs run-task `
    --cluster ${aws_ecs_cluster.main.name} `
    --task-definition ${aws_ecs_task_definition.db_init.family} `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[${aws_subnet.public1.id},${aws_subnet.public2.id}],securityGroups=[${aws_security_group.ecs_sg.id}],assignPublicIp=ENABLED}" `
    --region ${var.aws_region}
    EOT
    }
}
