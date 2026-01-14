resource "aws_s3_bucket" "backend_bucket" {
  bucket = "${var.project_name}-storage"

  tags = {
    Name = var.project_name
  }
}

resource "aws_s3_bucket_versioning" "backend_versioning" {
  bucket = aws_s3_bucket.backend_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}
