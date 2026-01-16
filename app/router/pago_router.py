from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.model.pago import Pago
from app.model.tipo_gasto import TipoGasto
from app.schema.pago import PagoCreate, PagoResponse, PagoUpdate


router = APIRouter()

@router.post("/", response_model=PagoResponse, status_code=status.HTTP_201_CREATED)
def crear_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo pago.
    
    Lógica de negocio:
    - Si el tipo_gasto es "Administrativo", es_reembolsable debe ser False
    - Si el tipo_gasto es "Reembolsable", es_reembolsable puede ser True o False
    """

    tipo_gasto = db.query(TipoGasto).filter(TipoGasto.id == pago.id_tipo_gasto).first()
    if not tipo_gasto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tipo de gasto con id {pago.id_tipo_gasto} no encontrado"
        )
    
    if tipo_gasto.nombre.lower() == "administrativo" and pago.es_reembolsable:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un gasto administrativo no puede ser reembolsable"
        )
    
    nuevo_pago = Pago(**pago.model_dump())
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    
    return nuevo_pago

@router.get("/", response_model=List[PagoResponse])
def obtener_pagos(
    skip: int = 0,
    limit: int = 100,
    id_obra: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene una lista de pagos con paginación opcional.
    Puede filtrar por id_obra si se proporciona.
    """
    query = db.query(Pago)
    
    if id_obra:
        query = query.filter(Pago.id_obra == id_obra)
    
    pagos = query.offset(skip).limit(limit).all()
    return pagos

@router.get("/{id_pago}", response_model=PagoResponse)
def obtener_pago(id_pago: int, db: Session = Depends(get_db)):
    """
    Obtiene un pago específico por su ID.
    """
    pago = db.query(Pago).filter(Pago.id_pago == id_pago).first()
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pago con id {id_pago} no encontrado"
        )
    return pago

@router.put("/{id_pago}", response_model=PagoResponse)
def actualizar_pago(
    id_pago: int,
    pago_update: PagoUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualiza un pago existente.
    """
    pago = db.query(Pago).filter(Pago.id_pago == id_pago).first()
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pago con id {id_pago} no encontrado"
        )
    
    update_data = pago_update.model_dump(exclude_unset=True)
    
    if "id_tipo_gasto" in update_data:
        tipo_gasto = db.query(TipoGasto).filter(
            TipoGasto.id == update_data["id_tipo_gasto"]
        ).first()
        if not tipo_gasto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tipo de gasto con id {update_data['id_tipo_gasto']} no encontrado"
            )
        
        es_reembolsable = update_data.get("es_reembolsable", pago.es_reembolsable)
        if tipo_gasto.nombre.lower() == "administrativo" and es_reembolsable:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un gasto administrativo no puede ser reembolsable"
            )
    
    for campo, valor in update_data.items():
        setattr(pago, campo, valor)
    
    db.commit()
    db.refresh(pago)
    
    return pago

@router.delete("/{id_pago}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pago(id_pago: int, db: Session = Depends(get_db)):
    """
    Elimina un pago por su ID.
    """
    pago = db.query(Pago).filter(Pago.id_pago == id_pago).first()
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pago con id {id_pago} no encontrado"
        )
    
    db.delete(pago)
    db.commit()
    
    return None