from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.db import get_db
from app.schema import obra as schema_obra
from app.model import obra as model_obra
from app.model.centro_operacion import CentroOperacion


router = APIRouter()


@router.post("/", response_model=schema_obra.ObraResponse, status_code=201)
def create_obra(obra: schema_obra.ObraCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva obra
    """
    try:
        new_obra = model_obra.Obra(
            nombre=obra.nombre,
            tipo_id=obra.tipo_id,
            estado_id=1,
            fecha_inicio=obra.fecha_inicio,
            fecha_fin=obra.fecha_fin,
            costo_proyecto=obra.costo_proyecto,
            id_responsable=obra.id_responsable,
            id_empresa=obra.id_empresa
        )
        
        if obra.centros_operacion:
            centros = db.query(CentroOperacion).filter(
                CentroOperacion.id.in_(obra.centros_operacion)
            ).all()
            new_obra.centros_operacion = centros
        
        db.add(new_obra)
        db.commit()
        db.refresh(new_obra)
        
        return new_obra
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear la obra: {str(e)}")


@router.get("/", response_model=List[schema_obra.ObraResponse])
def read_obras(
    id_empresa: int = 1,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las obras de una empresa
    """
    obras = db.query(model_obra.Obra).filter(
        model_obra.Obra.id_empresa == id_empresa
    ).offset(skip).limit(limit).all()
    
    return obras


@router.get("/{obra_id}", response_model=schema_obra.ObraResponse)
def read_obra(obra_id: int, db: Session = Depends(get_db)):
    """
    Obtener una obra por ID
    """
    db_obra = db.query(model_obra.Obra).filter(
        model_obra.Obra.id_obra == obra_id
    ).first()
    
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    return db_obra


@router.put("/{obra_id}", response_model=schema_obra.ObraResponse)
def update_obra(obra_id: int, obra: schema_obra.ObraUpdate, db: Session = Depends(get_db)):
    """
    Actualizar una obra existente
    """
    try:
        db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
        if db_obra is None:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        
        update_data = obra.model_dump(exclude_unset=True)
        
        centros_ids = update_data.pop('centros_operacion', None)
        
        for key, value in update_data.items():
            setattr(db_obra, key, value)
        
        if centros_ids is not None:
            centros = db.query(CentroOperacion).filter(
                CentroOperacion.id.in_(centros_ids)
            ).all()
            db_obra.centros_operacion = centros
        
        db.commit()
        db.refresh(db_obra)
        
        return db_obra
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar la obra: {str(e)}")


@router.delete("/{obra_id}")
def delete_obra(obra_id: int, db: Session = Depends(get_db)):
    """
    Eliminar una obra
    """
    db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    db.delete(db_obra)
    db.commit()
    
    return {"ok": True, "message": "Obra eliminada correctamente", "id_obra": obra_id}