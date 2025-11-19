# app/router/__init__.py
from fastapi import APIRouter

# Crear el router principal
router = APIRouter()

def init_routers():
    # Importaciones locales dentro de la función para evitar importaciones circulares
    from . import auth_router
    from . import user_router
    from . import role_router
    from . import role_permission_router
    from . import document_router
    from . import obra_router
    from . import estado_etapa_router
    from . import etapa_ejecucion_router
    from . import beneficiario_router
    from . import informacion_financista_router
    from . import informacion_contratista_router
    from . import centro_operacion_router
    
    # Incluir los routers
    router.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
    router.include_router(user_router.router, prefix="/users", tags=["Users"])
    router.include_router(role_router.router, prefix="/roles", tags=["Roles"])
    router.include_router(role_permission_router.router, prefix="/role-permissions", tags=["Role Permissions"])
    router.include_router(document_router.router, prefix="/documents", tags=["Documents"])
    router.include_router(obra_router.router, prefix="/obras", tags=["Obras"])
    router.include_router(estado_etapa_router.router, prefix="/estados-etapa", tags=["Estados de Etapa"])
    router.include_router(etapa_ejecucion_router.router, prefix="/etapas-ejecucion", tags=["Etapas de Ejecución"])
    router.include_router(beneficiario_router.router, prefix="/beneficiarios", tags=["Beneficiarios"])
    router.include_router(informacion_financista_router.router, prefix="/informacion-financistas", tags=["Información Financistas"])
    router.include_router(informacion_contratista_router.router, prefix="/informacion-contratistas", tags=["Información Contratistas"])
    router.include_router(centro_operacion_router.router, prefix="/centro_operacion_router", tags=["Centro de Operación"])
    
    return router