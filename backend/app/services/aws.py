# app/services/aws.py
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from fastapi import HTTPException
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class S3Client:
    """Cliente singleton para AWS S3"""
    
    _instance = None
    _client = None
    _is_available = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(S3Client, cls).__new__(cls)
            cls._instance._initialize_client()
        return cls._instance
    
    def _initialize_client(self):
        """Inicializa el cliente de S3"""
        if not settings.S3_ENABLED:
            logger.warning("AWS S3 no está configurado completamente")
            logger.info(f"   - AWS_ACCESS_KEY_ID: {'OK' if settings.AWS_ACCESS_KEY_ID else 'FALTA'}")
            logger.info(f"   - AWS_SECRET_ACCESS_KEY: {'OK' if settings.AWS_SECRET_ACCESS_KEY else 'FALTA'}")
            logger.info(f"   - AWS_BUCKET_NAME: {'OK' if settings.AWS_BUCKET_NAME else 'FALTA'}")
            self._is_available = False
            return
        
        try:
            self._client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            self._is_available = True
            logger.info("Cliente S3 inicializado correctamente")
        except NoCredentialsError:
            logger.error("Credenciales de AWS no encontradas")
            self._is_available = False
        except Exception as e:
            logger.error(f"Error al inicializar cliente S3: {e}")
            self._is_available = False
    
    @property
    def client(self):
        """Retorna el cliente S3"""
        if not self._is_available or self._client is None:
            raise HTTPException(
                status_code=503,
                detail="Servicio S3 no disponible. Verifica la configuración de AWS."
            )
        return self._client
    
    @property
    def bucket_name(self) -> str:
        """Retorna el nombre del bucket"""
        if not settings.AWS_BUCKET_NAME:
            raise HTTPException(
                status_code=503,
                detail="Bucket S3 no configurado"
            )
        return settings.AWS_BUCKET_NAME
    
    @property
    def is_available(self) -> bool:
        """Indica si S3 está disponible"""
        return self._is_available
    
    async def verify_connection(self) -> bool:
        """Verifica que el bucket existe y es accesible"""
        if not self._is_available:
            logger.warning("S3 no está disponible")
            return False
        
        try:
            self._client.head_bucket(Bucket=settings.AWS_BUCKET_NAME)
            logger.info(f"Conexión exitosa con bucket: {settings.AWS_BUCKET_NAME}")
            return True
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            if error_code == '404':
                logger.error(f"El bucket '{settings.AWS_BUCKET_NAME}' no existe")
            elif error_code == '403':
                logger.error(f"Sin permisos para acceder al bucket '{settings.AWS_BUCKET_NAME}'")
            else:
                logger.error(f"Error al conectar con S3: {e}")
            return False
        except Exception as e:
            logger.error(f"Error inesperado: {e}")
            return False


# Instancia global
s3_client = S3Client()


def get_s3_client():
    """Dependencia para FastAPI"""
    return s3_client.client


def get_bucket_name() -> str:
    """Dependencia para FastAPI"""
    return s3_client.bucket_name


def is_s3_available() -> bool:
    """Verifica disponibilidad de S3"""
    return s3_client.is_available