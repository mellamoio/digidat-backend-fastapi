from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.config.db import get_db
from app.schema import obra as schema_obra
from app.model import obra as model_obra
from app.model.centro_operacion import CentroOperacion
from app.model.users import User

router = APIRouter()

@router.post("/", response_model=schema_obra.ObraResponse, status_code=201)
def create_obra(obra: schema_obra.ObraCreate, db: Session = Depends(get_db)):
    try:
        # Validar que centros_operacion no esté vacío
        if not obra.centros_operacion or len(obra.centros_operacion) == 0:
            raise HTTPException(
                status_code=422, 
                detail="Debe seleccionar al menos un centro de operación"
            )
        
        # Validar que el responsable exista
        responsable = db.query(User).filter(User.id_responsable == obra.id_responsable).first()
        if not responsable:
            raise HTTPException(
                status_code=404,
                detail=f"El usuario responsable con ID {obra.id_responsable} no existe"
            )
        
        # Verificar que los centros de operación existan
        centros = db.query(CentroOperacion).filter(
            CentroOperacion.id.in_(obra.centros_operacion)
        ).all()
        
        if len(centros) != len(obra.centros_operacion):
            raise HTTPException(
                status_code=404,
                detail="Uno o más centros de operación no existen"
            )
        
        # Crear la obra
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
        
        # Asignar centros de operación
        new_obra.centros_operacion = centros
        
        db.add(new_obra)
        db.commit()
        db.refresh(new_obra)
        
        return new_obra
    except HTTPException:
        raise
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
    obras = db.query(model_obra.Obra).options(
        joinedload(model_obra.Obra.centros_operacion),
        joinedload(model_obra.Obra.responsable)
    ).filter(
        model_obra.Obra.id_empresa == id_empresa
    ).offset(skip).limit(limit).all()
    
    return obras

@router.get("/{obra_id}", response_model=schema_obra.ObraResponse)
def read_obra(obra_id: int, db: Session = Depends(get_db)):
    db_obra = db.query(model_obra.Obra).options(
        joinedload(model_obra.Obra.centros_operacion),
        joinedload(model_obra.Obra.responsable)
    ).filter(model_obra.Obra.id_obra == obra_id).first()
    
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    return db_obra

@router.put("/{obra_id}", response_model=schema_obra.ObraResponse)
def update_obra(obra_id: int, obra: schema_obra.ObraUpdate, db: Session = Depends(get_db)):
    try:
        db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
        if db_obra is None:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        
        # Validar responsable si se proporciona
        if obra.id_responsable is not None:
            responsable = db.query(User).filter(User.id_responsable == obra.id_responsable).first()
            if not responsable:
                raise HTTPException(
                    status_code=404,
                    detail=f"El usuario responsable con ID {obra.id_responsable} no existe"
                )
        
        # Validar centros_operacion si se proporciona
        if obra.centros_operacion is not None:
            if len(obra.centros_operacion) == 0:
                raise HTTPException(
                    status_code=422,
                    detail="Debe seleccionar al menos un centro de operación"
                )
            
            # Verificar que existan
            centros = db.query(CentroOperacion).filter(
                CentroOperacion.id.in_(obra.centros_operacion)
            ).all()
            
            if len(centros) != len(obra.centros_operacion):
                raise HTTPException(
                    status_code=404,
                    detail="Uno o más centros de operación no existen"
                )
            
            db_obra.centros_operacion = centros
        
        # Actualizar otros campos
        update_data = obra.dict(exclude_unset=True, exclude={'centros_operacion'})
        
        for key, value in update_data.items():
            setattr(db_obra, key, value)
        
        db.commit()
        db.refresh(db_obra)
        
        return db_obra
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar la obra: {str(e)}")

@router.delete("/{obra_id}")
def delete_obra(obra_id: int, db: Session = Depends(get_db)):
    db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    db.delete(db_obra)
    db.commit()
    
    return {"ok": True, "message": "Obra eliminada correctamente", "id_obra": obra_id}