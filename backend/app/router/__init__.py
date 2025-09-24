# app/router/__init__.py
from fastapi import APIRouter
from . import (
    project_router,
    document_router,
    user_router,
    role_router,
    role_permission_router,
    auth_router,
    obra_router,
    estado_etapa_router,
    etapa_ejecucion_router,
    responsable_router,
    beneficiario_router,
    informacion_financista_router,
    informacion_contratista_router
)

router = APIRouter()

# Include all routers with their respective prefixes and tags
router.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
router.include_router(user_router.router, prefix="/users", tags=["Users"])
router.include_router(role_router.router, prefix="/roles", tags=["Roles"])
router.include_router(role_permission_router.router, prefix="/role-permissions", tags=["Role Permissions"])
router.include_router(project_router.router, prefix="/projects", tags=["Projects"])
router.include_router(document_router.router, prefix="/documents", tags=["Documents"])
router.include_router(obra_router.router, prefix="/obras", tags=["Obras"])
router.include_router(estado_etapa_router.router, prefix="/estados-etapa", tags=["Estados de Etapa"])
router.include_router(etapa_ejecucion_router.router, prefix="/etapas-ejecucion", tags=["Etapas de Ejecución"])
router.include_router(responsable_router.router, prefix="/responsables", tags=["Responsables"])
router.include_router(beneficiario_router.router, prefix="/beneficiarios", tags=["Beneficiarios"])
router.include_router(informacion_financista_router.router, prefix="/info-financistas", tags=["Información Financistas"])
router.include_router(informacion_contratista_router.router, prefix="/info-contratistas", tags=["Información Contratistas"])