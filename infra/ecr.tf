resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-ecr"
  image_tag_mutability = "MUTABLE"

  tags = {
    Environment = "develop"
    Project     = var.project_name
  }
}
