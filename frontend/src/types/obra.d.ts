export interface Usuario {
    id: number
    nombre: string
}

export interface CentroOperacion {
    id: number
    nombre: string
}

export interface Obra {
    id: number
    nombre: string
    tipo_id: number
    estado_id: number
    costo_proyecto: string | number
    fecha_reembolso?: string
    fecha_conclusion: string
    usuarios: Usuario[]
    centros_operacion: CentroOperacion[]
    id_empresa: number
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

export interface ObraCreate {
    nombre: string
    tipo_id: number
    estado_id: number
    costo_proyecto: number
    fecha_reembolso?: string
    fecha_conclusion: string
    usuarios: number[]
    centros_operacion: number[]
    id_empresa: number
}