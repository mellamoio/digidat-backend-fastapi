# Data source para obtener Policy de Execution para ECS
data "aws_iam_policy" "ecs_task_execution_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Role para ECS Task Execution
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project_name}-ecs-task-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# Attach policy para CloudWatch logs
resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = data.aws_iam_policy.ecs_task_execution_policy.arn
}

# IAM Role para ECS Task (aplicación)
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# Policy para acceso a S3
resource "aws_iam_role_policy" "ecs_task_s3_policy" {
  name = "${var.project_name}-ecs-task-s3-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3BucketAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.backend_bucket.arn}/*"
      },
      {
        Sid    = "S3BucketListAccess"
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.backend_bucket.arn
      }
    ]
  })
}

# IAM User para credenciales (opcional, para CI/CD)
resource "aws_iam_user" "backend_deploy" {
  name = "${var.project_name}-deploy-user"

  tags = var.tags
}

# Policy para push a ECR
resource "aws_iam_user_policy" "backend_deploy_ecr" {
  name = "${var.project_name}-deploy-ecr-policy"
  user = aws_iam_user.backend_deploy.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ECRPush"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = aws_ecr_repository.backend.arn
      },
      {
        Sid    = "ECRToken"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      }
    ]
  })
}

# Access Key para CI/CD
resource "aws_iam_access_key" "backend_deploy" {
  user = aws_iam_user.backend_deploy.name
}

output "deploy_user_access_key_id" {
  value       = aws_iam_access_key.backend_deploy.id
  description = "Access Key ID para CI/CD"
  sensitive   = true
}

output "deploy_user_secret_access_key" {
  value       = aws_iam_access_key.backend_deploy.secret
  description = "Secret Access Key para CI/CD"
  sensitive   = true
}