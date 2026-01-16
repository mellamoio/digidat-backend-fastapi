resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.project_name}/backend"
  retention_in_days = 1  # 💸 COSTO CERO: retención mínima

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-ecs-logs" }
  )
}

output "cloudwatch_log_group" {
  value       = aws_cloudwatch_log_group.ecs_logs.name
  description = "CloudWatch Log Group para ECS"
}