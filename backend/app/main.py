from fastapi import FastAPI
from app.router import project_router, document_router, user_router, role_router, role_permission_router

app = FastAPI()


app.include_router(role_router.router, prefix="/api/v1/role")
app.include_router(user_router.router, prefix="/api/v1/user")

app.include_router(project_router.router, prefix="/api/v1/projects")
app.include_router(document_router.router, prefix="/api/v1/documents")

app.include_router(role_permission_router.router, prefix="/api/v1/role-permission")