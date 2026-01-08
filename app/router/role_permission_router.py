from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.db import SessionLocal
from app.model.roles import Role

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/roles-with-permissions/")
def get_roles_with_permissions(db: Session = Depends(get_db)):
    roles = db.query(Role).all()
    result = []
    for role in roles:
        result.append({
            "id_role": role.id_role,
            "name": role.name,
            "permissions": [perm.name for perm in role.permissions]
        })
    return result