from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.db import get_db
from app.model.informacion_contratista import InformacionContratista
from app.schema.informacion_contratista import (
    InformacionContratistaCreate,
    InformacionContratistaUpdate,
    InformacionContratistaResponse
)

from app.utils.response import custom_response


router = APIRouter()


@router.get("/")
def listar(db: Session = Depends(get_db)):
    infos = db.query(InformacionContratista).all()

    data = [
        InformacionContratistaResponse.from_orm(info).dict()
        for info in infos
    ]

    return custom_response(
        code=status.HTTP_200_OK,
        message="Listado de Información de contratistas",
        data=data
    )


@router.get("/{info_id}")
def obtener(info_id: int, db: Session = Depends(get_db)):
    info = db.query(InformacionContratista).filter_by(id=info_id).first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de contratista no encontrada",
            response_code=False
        )

    data = InformacionContratistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de contratista encontrada",
        data=data
    )

@router.post("/")
def crear(data: InformacionContratistaCreate, db: Session = Depends(get_db)):
    info = InformacionContratista(**data.dict())
    db.add(info)
    db.commit()
    db.refresh(info)

    response_data = InformacionContratistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_201_CREATED,
        message="Información de contratista creada correctamente",
        data=response_data
    )


@router.put("/{info_id}")
def actualizar(
    info_id: int,
    data: InformacionContratistaUpdate,
    db: Session = Depends(get_db)
):
    info = db.query(InformacionContratista).filter_by(id=info_id).first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de contratista no encontrada",
            response_code=False
        )

    for field, value in data.dict(exclude_unset=True).items():
        setattr(info, field, value)

    db.commit()
    db.refresh(info)

    response_data = InformacionContratistaResponse.from_orm(info).dict()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de contratista actualizada correctamente",
        data=response_data
    )


@router.delete("/{info_id}")
def eliminar(info_id: int, db: Session = Depends(get_db)):
    info = db.query(InformacionContratista).filter_by(id=info_id).first()

    if not info:
        return custom_response(
            code=status.HTTP_404_NOT_FOUND,
            message="Información de contratista no encontrada",
            response_code=False
        )

    db.delete(info)
    db.commit()

    return custom_response(
        code=status.HTTP_200_OK,
        message="Información de contratista eliminada correctamente",
        data=None
    )
