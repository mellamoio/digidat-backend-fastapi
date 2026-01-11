from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.config.db import get_async_db
from app.schema.actividad_etapa import ActividadEtapaResponse, ActividadEtapaCreate, ActividadEtapaEdit
from app.model.actividad_etapa import ActividadEtapa
from app.model.estado_etapa import EstadoEtapa
from app.utils.auth import get_current_user


router = APIRouter(dependencies=[Depends(get_current_user)])


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
async def inicializar_actividades_obra(id_obra: int, db: AsyncSession = Depends(get_async_db)):
    """
    Inicializar todas las actividades de etapa para una obra
    """
    # Verificar que la obra existe
    from app.model.obra import Obra
    result = await db.execute(select(Obra).where(Obra.id_obra == id_obra))
    obra = result.scalars().first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    # Verificar si ya tiene actividades
    result = await db.execute(select(ActividadEtapa).where(ActividadEtapa.id_obra == id_obra).limit(1))
    exists = result.scalars().first()
    
    if exists:
        raise HTTPException(
            status_code=400, 
            detail=f"La obra ya tiene actividades registradas"
        )
    
    # Obtener todos los estados de etapa
    result = await db.execute(select(EstadoEtapa).order_by(EstadoEtapa.orden))
    estados = result.scalars().all()
    
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
    
    await db.commit()
    
    return {
        "message": f"Se crearon {len(actividades_creadas)} actividades para la obra",
        "total_actividades": len(actividades_creadas)
    }


@router.get("/", response_model=List[ActividadEtapaResponse])
async def get_actividades_etapa(
    id_estado_etapa: int = None,
    id_obra: int = None,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Obtener todas las actividades de etapa, opcionalmente filtradas por estado o obra
    """
    stmt = select(ActividadEtapa)
    
    if id_estado_etapa:
        stmt = stmt.where(ActividadEtapa.id_estado_etapa == id_estado_etapa)
    
    if id_obra:
        stmt = stmt.where(ActividadEtapa.id_obra == id_obra)
    
    result = await db.execute(stmt.order_by(ActividadEtapa.id_estado_etapa, ActividadEtapa.orden))
    actividades = result.scalars().all()
    return actividades


@router.get("/{actividad_id}", response_model=ActividadEtapaResponse)
async def get_actividad_etapa(actividad_id: int, db: AsyncSession = Depends(get_async_db)):
    """
    Obtener una actividad de etapa específica por ID
    """
    result = await db.execute(select(ActividadEtapa).where(ActividadEtapa.id_etapa == actividad_id))
    actividad = result.scalars().first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    return actividad


@router.post("/", response_model=ActividadEtapaResponse)
async def create_actividad_etapa(
    actividad: ActividadEtapaCreate, 
    db: AsyncSession = Depends(get_async_db)
    ):
    """
    Crear una nueva actividad de etapa
    """
    nueva_actividad = ActividadEtapa(**actividad.dict())
    db.add(nueva_actividad)
    await db.commit()
    await db.refresh(nueva_actividad)
    return nueva_actividad

@router.put("/{actividad_id}", response_model=ActividadEtapaResponse)
async def update_actividad_etapa(
    actividad_id: int,
    actividad_update: ActividadEtapaEdit,
    db: AsyncSession = Depends(get_async_db)
):
    
    """
    Editar una actividad de etapa (solo nombre y comentario)
    """
    result = await db.execute(
        select(ActividadEtapa).where(ActividadEtapa.id_etapa == actividad_id)
    )
    actividad = result.scalars().first()

    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    
    for key, value in actividad_update.model_dump(exclude_unset=True).items():
        setattr(actividad, key, value)

    await db.commit()
    await db.refresh(actividad)
    return actividad



@router.delete("/{actividad_id}")
async def delete_actividad_etapa(actividad_id: int, db: AsyncSession = Depends(get_async_db)):
    """
    Eliminar una actividad de etapa
    """
    result = await db.execute(select(ActividadEtapa).where(ActividadEtapa.id_etapa == actividad_id))
    actividad = result.scalars().first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    
    await db.delete(actividad)
    await db.commit()
    return {"message": "Actividad eliminada correctamente"}