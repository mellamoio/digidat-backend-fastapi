from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.db import get_db
from app.schema.actividad_etapa import ActividadEtapaResponse, ActividadEtapaCreate, ActividadEtapaEdit
from app.model.actividad_etapa import ActividadEtapa
from app.model.estado_etapa import EstadoEtapa


router = APIRouter()


# Actividades por defecto para cada estado
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


@router.post("/inicializar-actividades/{id_obra}")
def inicializar_actividades_obra(id_obra: int, db: Session = Depends(get_db)):
    """
    Inicializar todas las actividades de etapa para una obra
    """
    # Verificar que la obra existe
    from app.model.obra import Obra
    obra = db.query(Obra).filter(Obra.id_obra == id_obra).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    # Verificar si ya tiene actividades
    actividades_existentes = db.query(ActividadEtapa).filter(
        ActividadEtapa.id_obra == id_obra
    ).count()
    
    if actividades_existentes > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"La obra ya tiene {actividades_existentes} actividades registradas"
        )
    
    # Obtener todos los estados de etapa
    estados = db.query(EstadoEtapa).order_by(EstadoEtapa.orden).all()
    
    actividades_creadas = []
    
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
            actividades_creadas.append(nueva_actividad)
    
    db.commit()
    
    return {
        "message": f"Se crearon {len(actividades_creadas)} actividades para la obra",
        "total_actividades": len(actividades_creadas)
    }


@router.get("/", response_model=List[ActividadEtapaResponse])
def get_actividades_etapa(
    id_estado_etapa: int = None,
    id_obra: int = None,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las actividades de etapa, opcionalmente filtradas por estado o obra
    """
    query = db.query(ActividadEtapa)
    
    if id_estado_etapa:
        query = query.filter(ActividadEtapa.id_estado_etapa == id_estado_etapa)
    
    if id_obra:
        query = query.filter(ActividadEtapa.id_obra == id_obra)
    
    actividades = query.order_by(ActividadEtapa.id_estado_etapa, ActividadEtapa.orden).all()
    return actividades


@router.get("/{actividad_id}", response_model=ActividadEtapaResponse)
def get_actividad_etapa(actividad_id: int, db: Session = Depends(get_db)):
    """
    Obtener una actividad de etapa específica por ID
    """
    actividad = db.query(ActividadEtapa).filter(ActividadEtapa.id_etapa == actividad_id).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    return actividad

@router.put("/{actividad_id}", response_model=schema_actividad_etapa.ActividadEtapa)
def update_actividad_etapa(actividad_id: int, actividad: schema_actividad_etapa.ActividadEtapaUpdate, db: Session = Depends(get_db)):
    db_actividad = db.query(model_actividad_etapa.ActividadEtapa).filter(model_actividad_etapa.ActividadEtapa.id_actividad == actividad_id).first()
    if db_actividad is None:
        raise HTTPException(status_code=404, detail="Actividad de etapa no encontrada")
    for key, value in actividad.dict(exclude_unset=True).items():
        setattr(db_actividad, key, value)
    db.commit()
    db.refresh(db_actividad)
    return db_actividad

@router.delete("/{actividad_id}", response_model=schema_actividad_etapa.ActividadEtapa)
def delete_actividad_etapa(actividad_id: int, db: Session = Depends(get_db)):
    """
    Eliminar una actividad de etapa
    """
    actividad = db.query(ActividadEtapa).filter(ActividadEtapa.id_etapa == actividad_id).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    
    db.delete(actividad)
    db.commit()
    return {"message": "Actividad eliminada correctamente"}