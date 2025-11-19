// frontend/src/types/obra.d.ts
import { SelectElement } from '@/satelite/types/select'

export interface CentroOperacion {
    id: number
    nombre: string
}

export interface Responsable {
    id: number
    nombre: string
}

export interface Obra {
    id: number
    nombre: string
    tipo_id: number
    estado_id: number
    costo_proyecto: string
    fecha_reembolso?: string
    fecha_conclusion: string
    responsable: Responsable[]
    unidades_gestion: { id: number; nombre: string }[]
    centros_operacion: CentroOperacion[]
    id_empresa: number
    posiciones?: SelectElement[]
    posicion_color?: string
    monto_recuperado?: number
    monto_pagado?: number
}
export interface ObraResponse {
    id_obra: number
    nombre: string
    tipo_id: number
    estado_id: number
    fecha_inicio: string | null
    fecha_fin: string | null
    costo_proyecto: number
    id_responsable: number
    id_empresa: number
    centros_operacion: CentroOperacion[]
    responsable: {
        id_responsable: number
        nombre: string
    } | null
}
