from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.config.db import get_async_db
from app.schema.obra import ObraBase, ObraCreate, ObraUpdate, ObraResponse
from app.model.obra import Obra
from app.model.centro_operacion import CentroOperacion
from app.model.estado_etapa import EstadoEtapa
from app.model.actividad_etapa import ActividadEtapa
from app.utils.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

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

async def crear_actividades_para_obra(db: AsyncSession, id_obra: int):
    result = await db.execute(select(EstadoEtapa).order_by(EstadoEtapa.orden))
    estados = result.scalars().all()
    
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
    
    await db.commit()

@router.post("/", response_model=ObraResponse, status_code=201)
async def create_obra(obra: ObraCreate, db: AsyncSession = Depends(get_async_db)):
    try:
        new_obra = Obra(
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
            result = await db.execute(select(CentroOperacion).where(
                CentroOperacion.id.in_(obra.centros_operacion)
            ))
            centros = result.scalars().all()
            new_obra.centros_operacion = centros
        
        db.add(new_obra)
        await db.commit()
        await db.refresh(new_obra)
        
        await crear_actividades_para_obra(db, new_obra.id_obra)
        
        return new_obra
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear la obra: {str(e)}")

@router.get("/", response_model=List[ObraBase])
async def read_obras(
    id_empresa: int = 1,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(Obra).where(
        Obra.id_empresa == id_empresa
    ).offset(skip).limit(limit))
    obras = result.scalars().all()
    
    return obras

@router.get("/{obra_id}", response_model=ObraResponse)
async def read_obra(obra_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Obra).where(
        Obra.id_obra == obra_id
    ))
    db_obra = result.scalars().first()
    
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    return db_obra

@router.put("/{obra_id}", response_model=ObraResponse)
async def update_obra(obra_id: int, obra: ObraUpdate, db: AsyncSession = Depends(get_async_db)):
    try:
        result = await db.execute(select(Obra).where(Obra.id_obra == obra_id))
        db_obra = result.scalars().first()
        if db_obra is None:
            raise HTTPException(status_code=404, detail="Obra no encontrada")
        
        update_data = obra.model_dump(exclude_unset=True)
        
        centros_ids = update_data.pop('centros_operacion', None)
        
        for key, value in update_data.items():
            setattr(db_obra, key, value)
        
        if centros_ids is not None:
            result = await db.execute(select(CentroOperacion).where(
                CentroOperacion.id.in_(centros_ids)
            ))
            centros = result.scalars().all()
            db_obra.centros_operacion = centros
        
        await db.commit()
        await db.refresh(db_obra)
        
        return db_obra
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar la obra: {str(e)}")

@router.delete("/{obra_id}")
async def delete_obra(obra_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.execute(select(Obra).where(Obra.id_obra == obra_id))
    db_obra = result.scalars().first()
    if db_obra is None:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    
    await db.delete(db_obra)
    await db.commit()
    
    return {"ok": True, "message": "Obra eliminada correctamente", "id_obra": obra_id}