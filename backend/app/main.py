import logging
from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
from typing import List, Optional
from pydantic import AnyHttpUrl

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

from app.router import (
    obra_router,
    estado_etapa_router,
    etapa_ejecucion_router,
    responsable_router,
    beneficiario_router,
    informacion_financista_router,
    informacion_contratista_router,
    user_router,
    role_router,
    auth_router,
    project_router,
    document_router,
    role_permission_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Iniciando la aplicación...")
    try:
        create_tables()
        await async_create_tables()
        logger.info("Tablas de la base de datos creadas correctamente")
    except Exception as e:
        logger.error(f"Error al crear tablas: {str(e)}")
        raise
    
    yield
    
    logger.info("Deteniendo la aplicación...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para la gestión de obras, proyectos y usuarios",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.DEBUG else None,
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="session",
    max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
)

app = register_exception_handlers(app)

api_router = APIRouter()

api_router.include_router(auth_router.router, prefix="/auth", tags=["Autenticación"])
api_router.include_router(user_router.router, prefix="/users", tags=["Usuarios"])
api_router.include_router(role_router.router, prefix="/roles", tags=["Roles"])
api_router.include_router(role_permission_router.router, prefix="/role-permissions", tags=["Permisos de Roles"])
api_router.include_router(project_router.router, prefix="/projects", tags=["Proyectos"])
api_router.include_router(document_router.router, prefix="/documents", tags=["Documentos"])
api_router.include_router(obra_router.router, prefix="/obras", tags=["Obras"])
api_router.include_router(estado_etapa_router.router, prefix="/estados-etapa", tags=["Estados de Etapa"])
api_router.include_router(etapa_ejecucion_router.router, prefix="/etapas-ejecucion", tags=["Etapas de Ejecución"])
api_router.include_router(responsable_router.router, prefix="/responsables", tags=["Responsables"])
api_router.include_router(beneficiario_router.router, prefix="/beneficiarios", tags=["Beneficiarios"])
api_router.include_router(informacion_financista_router.router, prefix="/informacion-financistas", tags=["Información Financistas"])
api_router.include_router(informacion_contratista_router.router, prefix="/informacion-contratistas", tags=["Información Contratistas"])

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    """
    Verifica el estado de salud de la API.
    """
    return {
        "status": "ok",
        "version": "1.0.0",
        "environment": "development" if settings.DEBUG else "production"
    }

@app.get("/")
async def root():
    """
    Ruta de bienvenida de la API.
    """
    return {
        "message": f"Bienvenido a {settings.PROJECT_NAME} API",
        "documentation": "/docs" if settings.DEBUG else None,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        ssl_keyfile=getattr(settings, 'SSL_KEYFILE', None),
        ssl_certfile=getattr(settings, 'SSL_CERTFILE', None)
    )