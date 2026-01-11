import boto3
from app.core.config import (
    AWS_REGION,
    AWS_BUCKET_NAME,
)

s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
)


def upload_file_to_s3(*, file_bytes: bytes, key: str, content_type: str) -> str:
    """
    Sube un archivo a S3 usando bytes (forma segura para FastAPI)
    """
    s3.put_object(
        Bucket=AWS_BUCKET_NAME,
        Key=key,
        Body=file_bytes,
        ContentType=content_type,
    )
    return key
