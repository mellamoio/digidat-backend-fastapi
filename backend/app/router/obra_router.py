<<<<<<< HEAD
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
=======
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..model import obra as model_obra
from ..model import etapa_ejecucion as model_etapa
from ..model import estado_etapa as model_estado
from ..schema import obra as schema_obra
from ..config.db import get_db
from datetime import datetime
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

# Create Obras
@router.post("/", response_model=schema_obra.Obra)
def create_obra(obra: schema_obra.ObraCreate, db: Session = Depends(get_db)):
    try:
        # Crear obra
        db_obra = model_obra.Obra(**obra.dict())
        db.add(db_obra)
        db.commit()
        db.refresh(db_obra)

        # Buscar el estado inicial "Priorización"
        estado_inicial = db.query(model_estado.EstadoEtapa).filter(
            model_estado.EstadoEtapa.nombre_estado == "Priorización"
        ).first()

        if not estado_inicial:
            raise HTTPException(
                status_code=400,
                detail="No existe el estado inicial 'Priorización' en la tabla estados_etapa"
            )

        # Crear etapa inicial asociada
        etapa_inicial = model_etapa.EtapaEjecucion(
            id_obra=db_obra.id_obra,
            id_estado=estado_inicial.id_estado
        )
        db.add(etapa_inicial)
        db.commit()

        return db_obra

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al crear la obra: {str(e)}"
        )


# get all Obras
@router.get("/", response_model=List[schema_obra.Obra])
def read_obras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        return db.query(model_obra.Obra).filter(model_obra.Obra.delete_date.is_(None)).offset(skip).limit(limit).all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al listar las obras: {str(e)}"
        )


# Get por ID
@router.get("/{obra_id}", response_model=schema_obra.Obra)
def read_obra(obra_id: int, db: Session = Depends(get_db)):
    try:
        db_obra = (
            db.query(model_obra.Obra)
            .filter(
                model_obra.Obra.id_obra == obra_id,
                model_obra.Obra.delete_date.is_(None)
            )
            .first()
        )
        if not db_obra:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        return db_obra
    except HTTPException:
        # Dejar pasar las excepciones HTTP tal cual
        raise
    except Exception as e:
        # Capturar solo errores inesperados
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener la obra: {str(e)}"
        )
    
    
# Actualizar una Obra
@router.put("/{obra_id}", response_model=schema_obra.Obra)
def update_obra(obra_id: int, obra: schema_obra.ObraUpdate, db: Session = Depends(get_db)):
    try:
        db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
        if not db_obra:
            raise HTTPException(status_code=404, detail="Obra no encontrada")

        for key, value in obra.dict(exclude_unset=True).items():
            setattr(db_obra, key, value)
        db.commit()
        db.refresh(db_obra)
        return db_obra
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error al actualizar la obra: {str(e)}"
        )

# Actualizar solo la etapa
@router.put("/{obra_id}/estado/{id_estado}", status_code=status.HTTP_200_OK)
def actualizar_estado_obra(obra_id: int, id_estado: int, db: Session = Depends(get_db)):
    try:
        # Validar que la obra exista
        obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
        if not obra:
            raise HTTPException(status_code=404, detail="Obra no encontrada")

        # Validar que el nuevo estado exista
        estado = db.query(model_estado.EstadoEtapa).filter(model_estado.EstadoEtapa.id_estado == id_estado).first()
        if not estado:
            raise HTTPException(status_code=404, detail="Estado de etapa no encontrado")

        # Obtener etapa actual de la obra
        etapa = db.query(model_etapa.EtapaEjecucion).filter(model_etapa.EtapaEjecucion.id_obra == obra_id).first()
        if not etapa:
            # Si no existe, crear la etapa (raro, pero se maneja)
            etapa = model_etapa.EtapaEjecucion(
                id_obra=obra_id,
                id_estado=id_estado
            )
            db.add(etapa)
        else:
            # Actualizar etapa existente
            etapa.id_estado = id_estado

        db.commit()
        db.refresh(etapa)

        return {
            "message": f"Estado de la obra '{obra.nombre}' actualizado correctamente a '{estado.nombre_estado}'",
            "obra_id": obra_id,
            "nuevo_estado": estado.nombre_estado
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar el estado de la obra: {str(e)}"
        )

# Sofdelete una Obra
@router.delete("/{obra_id}", status_code=status.HTTP_200_OK)
def soft_delete_obra(obra_id: int, db: Session = Depends(get_db)):
    try:
        db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
        if not db_obra:
            raise HTTPException(status_code=404, detail="Obra no encontrada")

        db_obra.delete_date = datetime.now()
        db.commit()
        return {"message": "Obra marcada como eliminada correctamente"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al eliminar la obra: {str(e)}")

>>>>>>> fd98077156a3a68778da09b098a82ff54cd639f5
