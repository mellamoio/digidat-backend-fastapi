from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.model.informacion_financista import InformacionFinancista
from app.schema.informacion_financista import (
    InformacionFinancistaCreate,
    InformacionFinancistaUpdate,
    InformacionFinancistaResponse
)
import json

router = APIRouter()

@router.get("/", response_model=List[InformacionFinancistaResponse])
async def get_informacion_financista(
    id_obra: int = Query(..., description="ID de la obra"),
    db: Session = Depends(get_db)
):
    """Obtener toda la información financiera de una obra"""
    try:
        
        info = db.query(InformacionFinancista).filter(
            InformacionFinancista.id_obra == id_obra
        ).all()
        
        print(f"✅ Encontrados {len(info)} registros")
        
        result = []
        for item in info:
            item_dict = {
                "id": item.id,
                "id_tipo_financista": item.id_tipo_financista,
                "id_obra": item.id_obra,
                "aspecto": item.aspecto,
                "comentarios": item.comentarios,
                "id_categoria_documento": item.id_categoria_documento,
                "responsables": item.responsables
            }
            
            if isinstance(item.id_categoria_documento, str):
                try:
                    item_dict["id_categoria_documento"] = json.loads(item.id_categoria_documento)
                except:
                    item_dict["id_categoria_documento"] = []
            
            if isinstance(item.responsables, str):
                try:
                    item_dict["responsables"] = json.loads(item.responsables)
                except:
                    item_dict["responsables"] = []
            
            result.append(item_dict)
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.post("/", status_code=201)
async def create_informacion_financista(
    data: InformacionFinancistaCreate,
    db: Session = Depends(get_db)
):
    """Crear nueva información financiera"""
    try:
        print(f"📝 Creando información financista: {data}")
        
        data_dict = data.dict()
        
        if 'id_categoria_documento' in data_dict and data_dict['id_categoria_documento'] is not None:
            data_dict['id_categoria_documento'] = json.dumps(data_dict['id_categoria_documento'])
        
        if 'responsables' in data_dict and data_dict['responsables'] is not None:
            data_dict['responsables'] = json.dumps(data_dict['responsables'])
        
        new_info = InformacionFinancista(**data_dict)
        db.add(new_info)
        db.commit()
        db.refresh(new_info)
        
        print(f"✅ Creado exitosamente con ID: {new_info.id}")
        
        response_data = {
            "id": new_info.id,
            "id_tipo_financista": new_info.id_tipo_financista,
            "id_obra": new_info.id_obra,
            "aspecto": new_info.aspecto,
            "comentarios": new_info.comentarios,
            "id_categoria_documento": json.loads(new_info.id_categoria_documento) if isinstance(new_info.id_categoria_documento, str) else new_info.id_categoria_documento or [],
            "responsables": json.loads(new_info.responsables) if isinstance(new_info.responsables, str) else new_info.responsables or []
        }
        
        # ✅ CAMBIO: Devolver con formato esperado por el frontend
        return {
            "success": True,
            "message": "Información financiera creada exitosamente",
            "data": response_data
        }
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error al crear: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al crear: {str(e)}")


@router.put("/{id}", response_model=InformacionFinancistaResponse)
async def update_informacion_financista(
    id: int,
    data: InformacionFinancistaUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar información financiera existente"""
    try:
        info = db.query(InformacionFinancista).filter(InformacionFinancista.id == id).first()
        if not info:
            raise HTTPException(status_code=404, detail="Información financiera no encontrada")
        
        update_data = data.dict(exclude_unset=True)
        
        if 'id_categoria_documento' in update_data and update_data['id_categoria_documento'] is not None:
            update_data['id_categoria_documento'] = json.dumps(update_data['id_categoria_documento'])
        if 'responsables' in update_data and update_data['responsables'] is not None:
            update_data['responsables'] = json.dumps(update_data['responsables'])
        
        for key, value in update_data.items():
            setattr(info, key, value)
        
        db.commit()
        db.refresh(info)
        return info
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{id}", status_code=204)
async def delete_informacion_financista(
    id: int,
    db: Session = Depends(get_db)
):
    """Eliminar información financiera"""
    try:
        info = db.query(InformacionFinancista).filter(InformacionFinancista.id == id).first()
        if not info:
            raise HTTPException(status_code=404, detail="Información financiera no encontrada")
        
        db.delete(info)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))