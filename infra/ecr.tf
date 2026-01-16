resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false  # 💸 COSTO CERO: sin scanning
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-ecr" }
  )
}

# 💸 COSTO CERO: sin lifecycle policy (elimina costo de gestión)
