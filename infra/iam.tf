resource "aws_iam_user" "backend_user" {
  name = "${var.project_name}-user"
}

data "aws_iam_policy_document" "backend_policy" {
  statement {
    sid = "ECSFargateAccess"
    actions = [
      "ecs:*",
      "elasticloadbalancing:*"
    ]
    resources = ["*"]
  }

  statement {
    sid = "RDSAccess"
    actions = [
      "rds:*",
      "rds-db:*"
    ]
    resources = ["*"]
  }

  statement {
    sid = "S3Access"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket"
    ]

    resources = [
      "arn:aws:s3:::${aws_s3_bucket.backend_bucket.bucket}",
      "arn:aws:s3:::${aws_s3_bucket.backend_bucket.bucket}/*"
    ]
  }

  statement {
    sid = "VPCAccess"
    actions = [
      "ec2:Describe*",
      "ec2:CreateSecurityGroup",
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:RevokeSecurityGroupIngress",
      "ec2:DeleteSecurityGroup",
      "ec2:CreateNetworkInterface",
      "ec2:AttachNetworkInterface",
      "ec2:DeleteNetworkInterface"
    ]
    resources = ["*"]
  }

  statement {
    sid = "CloudWatchLogsAccess"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
      "logs:DescribeLogGroups"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "backend_policy" {
  name   = "${var.project_name}-policy"
  policy = data.aws_iam_policy_document.backend_policy.json
}

resource "aws_iam_user_policy_attachment" "backend_attach" {
  user       = aws_iam_user.backend_user.name
  policy_arn = aws_iam_policy.backend_policy.arn
}

resource "aws_iam_access_key" "backend_access_key" {
  user = aws_iam_user.backend_user.name
}

# IAM role for ECS task execution (needed by aws_ecs_task_definition)
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project_name}-ecs-task-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_attach" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}