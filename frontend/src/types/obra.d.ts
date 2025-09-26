import { SelectElement } from '@/satelite/types/select'

export interface Obra {
    id: number
    nombre: string
    tipo_id: number
    estado_id: number
    costo_proyecto: string
    fecha_reembolso?: string
    fecha_conclusion: string
    responsable: { id: number; nombre: string }[]
    unidades_gestion: { id: number; nombre: string }[]
    centros_operacion: { id: number; nombre: string }[]
    id_empresa: number
    posiciones?: SelectElement[]
    posicion_color?: string
    monto_recuperado?: number
    monto_pagado?: number
    responsable: { id: number; nombre: string }[]
}

export interface ObraResponse {
    id: number
    nombre: string
    tipo_id: number
    estado_id: number
    costo_proyecto: string
    fecha_reembolso?: string
    fecha_conclusion: string
    responsable: { id: number; nombre: string }[]
    unidades_gestion: { id: number; nombre: string }[]
    centros_operacion: { id: number; nombre: string }[]
    id_empresa: number
    posiciones?: SelectElement[]
    posicion_color?: string
    monto_recuperado?: number
    monto_pagado?: number
}
