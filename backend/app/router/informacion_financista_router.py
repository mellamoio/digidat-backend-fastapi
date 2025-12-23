from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.db import get_db
from app.model.informacion_financista import InformacionFinancista
from app.schema.informacion_financista import (
    InformacionFinancistaCreate,
    InformacionFinancistaUpdate,
    InformacionFinancistaResponse
)

from app.utils.response import custom_response


router = APIRouter()


@router.get("/")
def listar(db: Session = Depends(get_db)):
    infos = db.query(InformacionFinancista).all()

    data = [
        InformacionFinancistaResponse.from_orm(info).dict()
        for info in infos
    ]

    return custom_response(
        code=status.HTTP_200_OK,
        message="Listado de información de financistas",
        data=data
    )


@router.get("/{info_id}")
def obtener(info_id: int, db: Session = Depends(get_db)):
    info = db.query(InformacionFinancista).filter_by(id=info_id).first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de financista no encontrada",
            response_code=False
        )

    data = InformacionFinancistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de financista encontrada",
        data=data
    )

@router.post("/")
def crear(data: InformacionFinancistaCreate, db: Session = Depends(get_db)):
    info = InformacionFinancista(**data.dict())
    db.add(info)
    db.commit()
    db.refresh(info)

    response_data = InformacionFinancistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_201_CREATED,
        message="Información de financista creada correctamente",
        data=response_data
    )


@router.put("/{info_id}")
def actualizar(
    info_id: int,
    data: InformacionFinancistaUpdate,
    db: Session = Depends(get_db)
):
    info = db.query(InformacionFinancista).filter_by(id=info_id).first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de financista no encontrada",
            response_code=False
        )

    for field, value in data.dict(exclude_unset=True).items():
        setattr(info, field, value)

    db.commit()
    db.refresh(info)

    response_data = InformacionFinancistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de financista actualizada correctamente",
        data=response_data
    )


@router.delete("/{info_id}")
def eliminar(info_id: int, db: Session = Depends(get_db)):
    info = db.query(InformacionFinancista).filter_by(id=info_id).first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de financista no encontrada",
            response_code=False
        )

    db.delete(info)
    db.commit()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de financista eliminada correctamente",
        data=None
    )
