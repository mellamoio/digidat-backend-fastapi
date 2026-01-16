resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-task"
  network_mode             = "awsvpc"
  
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${aws_ecr_repository.backend.repository_url}:latest"

      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "DEBUG", value = tostring(var.debug) },
        { name = "HOST", value = "0.0.0.0" },
        { name = "PORT", value = tostring(var.container_port) },
        { name = "SECRET_KEY", value = var.secret_key },
        { name = "ALGORITHM", value = var.algorithm },
        { name = "ACCESS_TOKEN_EXPIRE_MINUTES", value = tostring(var.access_token_expire_minutes) },
        { name = "MYSQL_HOST", value = aws_db_instance.mysql.address },
        { name = "MYSQL_PORT", value = "3306" },
        { name = "MYSQL_DATABASE", value = var.db_name },
        { name = "MYSQL_USER", value = var.db_username },
        { name = "MYSQL_PASSWORD", value = var.db_password },
        { name = "AWS_REGION", value = var.aws_region },
        { name = "AWS_BUCKET_NAME", value = aws_s3_bucket.backend_bucket.bucket },
        { 
          name  = "BACKEND_CORS_ORIGINS",
          value = "[\"http://localhost:5173\"]"
        }
      ]

      essential = true

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "backend"
        }
      }
    }
  ])

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-task-definition" }
  )
}

resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-ecs-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-ecs-cluster" }
  )
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

resource "aws_security_group" "ecs_sg" {
  name        = "${var.project_name}-ecs-sg"
  description = "Security group para ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow HTTP from ALB"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-ecs-sg" }
  )
}

resource "aws_ecs_service" "backend_service" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.ecs_desired_count
  launch_type     = "FARGATE"

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  network_configuration {
    subnets          = [aws_subnet.public1.id, aws_subnet.public2.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "backend"
    container_port   = var.container_port
  }

  depends_on = [
    aws_lb_listener.front_end,
    aws_db_instance.mysql
  ]

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-ecs-service" }
  )
}

