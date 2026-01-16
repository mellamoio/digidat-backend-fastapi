resource "aws_s3_bucket" "backend_bucket" {
  bucket = "${var.project_name}-storage-${data.aws_caller_identity.current.account_id}"

  tags = merge(
    var.tags,
    { Name = "${var.project_name}-s3-bucket" }
  )
}

resource "aws_s3_bucket_versioning" "backend_versioning" {
  bucket = aws_s3_bucket.backend_bucket.id

  versioning_configuration {
    status = "Suspended"  # 💸 COSTO CERO: sin versionado
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backend_encryption" {
  bucket = aws_s3_bucket.backend_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "backend_pab" {
  bucket = aws_s3_bucket.backend_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 💸 COSTO CERO: sin lifecycle policies (elimina costo de gestión)

data "aws_caller_identity" "current" {}
