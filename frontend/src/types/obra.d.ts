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
    monto_recuperado?: number
    monto_pagado?: number
}