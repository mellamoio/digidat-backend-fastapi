import logging
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)
logger = logging.getLogger(__name__)

from app.core.config import settings
from app.core.database import create_tables, async_create_tables
from app.core.exceptions import register_exception_handlers

# Importar S3 solo si está configurado
s3_client = None
if settings.S3_ENABLED:
    try:
        from app.services.aws import s3_client as s3_client_module
        s3_client = s3_client_module
        logger.info("Configuracion S3 detectada e importada")
    except ImportError as e:
        logger.error(f"Error al importar modulo S3: {e}")
        s3_client = None
    except Exception as e:
        logger.error(f"Error al inicializar S3: {e}")
        s3_client = None
else:
    logger.warning("S3 no configurado en .env")

from app.router import (
    obra_router,
    estado_etapa_router,
    actividad_etapa_router,
    beneficiario_router,
    informacion_financista_router,
    informacion_contratista_router,
    user_router,
    role_router,
    auth_router,
    document_router,
    role_permission_router,
    centro_operacion_router,
    tipos_obra_router,
    tipo_gasto_router,
    pago_router,
)

from app.router.categoria_documento_router import router as categoria_documento_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestor del ciclo de vida de la aplicación"""
    logger.info("Iniciando la aplicacion...")
    
    try:
        # Solo usar la función asíncrona
        await async_create_tables()
        logger.info("Tablas de la base de datos creadas correctamente")
    except Exception as e:
        logger.error(f"Error al crear tablas: {str(e)}")
        # No hacer raise para que la app siga corriendo
        logger.warning("La aplicacion continuara sin crear tablas")
    
    if s3_client and settings.S3_ENABLED:
        try:
            s3_status = await s3_client.verify_connection()
            if not s3_status:
                logger.warning("La aplicacion continuara sin S3 disponible")
        except Exception as e:
            logger.error(f"Error al verificar S3: {str(e)}")
            logger.warning("La aplicacion continuara sin S3")
    
    yield
    
    logger.info("Deteniendo la aplicacion...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para la gestión de obras, proyectos y usuarios",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="session",
    max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://backend.carimsac.com",
        "http://digidat-storage-950071105194.s3-website-us-east-1.amazonaws.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Autenticación"])
api_router.include_router(user_router, prefix="/users", tags=["Usuarios"])
api_router.include_router(role_router, prefix="/roles", tags=["Roles"])
api_router.include_router(role_permission_router, prefix="/role-permissions", tags=["Permisos de Roles"])
api_router.include_router(document_router, prefix="/documents", tags=["Documentos"])
api_router.include_router(obra_router, prefix="/obras", tags=["Obras"])
api_router.include_router(centro_operacion_router, prefix="/centros-operacion", tags=["Centros de Operación"])
api_router.include_router(estado_etapa_router, prefix="/estados-etapa", tags=["Estados de Etapa"])
api_router.include_router(actividad_etapa_router, prefix="/actividad-etapa", tags=["Actividades de Etapas"])
api_router.include_router(beneficiario_router, prefix="/beneficiarios", tags=["Beneficiarios"])
api_router.include_router(informacion_financista_router, prefix="/informacion-financista", tags=["Información Financista"])
api_router.include_router(informacion_contratista_router, prefix="/informacion-contratista", tags=["Información Contratistas"])
api_router.include_router(tipos_obra_router, prefix="/tipos-obra", tags=["Tipos de Obra"])
api_router.include_router(tipo_gasto_router, prefix="/tipos-gasto", tags=["Tipos de Gasto"])
api_router.include_router(pago_router, prefix="/pagos", tags=["Pagos"])
api_router.include_router(categoria_documento_router, prefix="/categorias-documento", tags=["Categorías de Documentos"])

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    """Endpoint de verificación de estado de salud de la API."""
    
    s3_status = "not_configured"
    if s3_client and settings.S3_ENABLED:
        try:
            s3_connected = await s3_client.verify_connection()
            s3_status = "ok" if s3_connected else "error"
        except:
            s3_status = "error"
    
    return {
        "status": "ok",
        "version": "1.0.0",
        "environment": "development" if settings.DEBUG else "production",
        "services": {
            "database": "ok",
            "s3": s3_status
        }
    }


@app.get("/")
async def root():
    """Ruta de bienvenida de la API."""
    return {
        "message": f"Bienvenido a {settings.PROJECT_NAME} API",
        "documentation": f"{settings.API_V1_STR}/docs" if settings.DEBUG else None,
        "health": f"{settings.API_V1_STR}/health",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
