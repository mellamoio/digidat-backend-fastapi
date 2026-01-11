from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config.db import get_async_db
from app.model.roles import Role

router = APIRouter()

@router.get("/roles-with-permissions/")
async def get_roles_with_permissions(db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Role))
    roles = result.scalars().all()
    out = []
    for role in roles:
        out.append({
            "id_role": role.id_role,
            "name": role.name,
            "permissions": [perm.name for perm in role.permissions]
        })
    return out