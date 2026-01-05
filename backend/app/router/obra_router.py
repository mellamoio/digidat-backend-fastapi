from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.db import get_db
from app.schema import obra as schema_obra
from app.model import obra as model_obra
from app.model.centro_operacion import CentroOperacion
from app.model.estado_etapa import EstadoEtapa
from app.model.actividad_etapa import ActividadEtapa


router = APIRouter()


ACTIVIDADES_DEFAULT = {
    "Priorización": [
        "Aprobar la Capacidad Presupuestal",
        "Aprobar la Ejecución Conjunta de Proyectos",
        "Evaluar la Propuesta de Proyectos del Sector Privado",
        "Aprobar la Lista de Proyectos Priorizados por Entidad Pública"
    ],
    "Actos Previos": [
        "Designar al Comité Especial",
        "Otorgar la Certificación Presupuestaria y/o compromiso de Priorización de Recursos para Entidades Públicas de Gobierno Nacional",
        "Aprobar las bases para el proceso de selección"
    ],
    "Selección": [
        "Realizar el Proceso de Selección",
        "Realizar la suscripción de Convenio",
        "Realizar la suscripción de contrato de la Supervisión del Proyecto",
        "Realizar modificación de Estudios",
        "Aprobar el Estudio definitivo, expediente de operación y/o mantenimiento",
        "Aprobar la Sustitución del Ejecutor de Proyecto",
        "Aprobar la ampliación de plazos",
        "Realizar la culminación y recepción del proyecto",
        "Aprobar la liquidación del proyecto"
    ],
    "Ejecución": [
        "Emitir conformidad de Mantenimiento u Operación"
    ],
    "Emisión de CIPRL o CIPGN": [
        "Emitir el CIPRL o CIPGN",
        "Emitir el CIPRA por el CIPGN por Avance de Obra"
    ]
}


def crear_actividades_para_obra(db: Session, id_obra: int):
    """
    Crea actividades de etapa para una obra.
    NOTA: Esta función NO hace commit, debe hacerse desde el llamador.
    """
    estados = db.query(EstadoEtapa).order_by(EstadoEtapa.orden).all()
    
    if not estados:
        raise HTTPException(
            status_code=500, 
            detail="No hay estados de etapa configurados en el sistema"
        )
    
    for estado in estados:
        actividades_nombres = ACTIVIDADES_DEFAULT.get(estado.nombre, [])
        
        for index, nombre_actividad in enumerate(actividades_nombres, start=1):
            nueva_actividad = ActividadEtapa(
                nombre_etapa=nombre_actividad,
                id_obra=id_obra,
                id_estado_etapa=estado.id,
                orden=index
            )
            db.add(nueva_actividad)
    # ✅ Removemos el db.commit() de aquí


@router.post("/", response_model=schema_obra.ObraResponse, status_code=201)
def create_obra(obra: schema_obra.ObraCreate, db: Session = Depends(get_db)):
    try:
        # 1. Crear la obra
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
        
        # 2. Asociar centros de operación si existen
        if obra.centros_operacion:
            centros = db.query(CentroOperacion).filter(
                CentroOperacion.id.in_(obra.centros_operacion)
            ).all()
            new_obra.centros_operacion = centros
        
        db.add(new_obra)
        db.flush()  # ✅ Usar flush en vez de commit para obtener el ID
        
        # 3. Crear actividades de etapa automáticamente
        crear_actividades_para_obra(db, new_obra.id_obra)
        
        # 4. Hacer UN SOLO commit de todo junto
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
    obras = db.query(model_obra.Obra).filter(
        model_obra.Obra.id_empresa == id_empresa
    ).offset(skip).limit(limit).all()
    
    return obras


@router.get("/{obra_id}", response_model=schema_obra.ObraResponse)
def read_obra(obra_id: int, db: Session = Depends(get_db)):
    db_obra = db.query(model_obra.Obra).filter(
        model_obra.Obra.id_obra == obra_id
    ).first()
    
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    return db_obra


@router.put("/{obra_id}", response_model=schema_obra.ObraResponse)
def update_obra(obra_id: int, obra: schema_obra.ObraUpdate, db: Session = Depends(get_db)):
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
    db_obra = db.query(model_obra.Obra).filter(model_obra.Obra.id_obra == obra_id).first()
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    db.delete(db_obra)
    db.commit()
    
    return {"ok": True, "message": "Obra eliminada correctamente", "id_obra": obra_id}