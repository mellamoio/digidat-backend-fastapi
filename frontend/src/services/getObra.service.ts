// frontend/src/services/getObra.service.ts
import { setQueryParams } from '../helpers/setQueryParams'
import { handleErrorRequest } from '../helpers/handleErrorRequest'
import type { Obra, ObraResponse } from '../types/obra'
import apiClient from '../api/api'

interface GetObrasRequest {
    id_empresa: number
}

interface CreateObraRequest {
    nombre: string
    tipo_id: number
    id_responsable: number
    fecha_inicio?: string | null
    fecha_fin?: string | null
    costo_proyecto?: number
    id_empresa: number
    centros_operacion: number[]
}

interface UpdateObraRequest {
    id: number
    nombre?: string
    tipo_id?: number
    id_responsable?: number
    fecha_inicio?: string | null
    fecha_fin?: string | null
    costo_proyecto?: number
    centros_operacion?: number[]
}

// GET - Obtener todas las obras
export const getObra = async ({
    id_empresa
}: GetObrasRequest): Promise<ObraResponse[]> => {
    try {
        const params = {
            id_empresa: id_empresa.toString()
        }

        const url = setQueryParams(params, 'v1/obras/')  // ← Barra final agregada

        const { data } = await apiClient.get<ObraResponse[]>(url)

        return data || []
    } catch (e) {
        throw handleErrorRequest(e)
    }
}

// GET - Obtener una obra por ID
export const getObraById = async (id: number): Promise<ObraResponse> => {
    try {
        const { data } = await apiClient.get<ObraResponse>(`v1/obras/${id}`)
        return data
    } catch (e) {
        throw handleErrorRequest(e)
    }
}

// POST - Crear una nueva obra
export const createObra = async (
    obraData: CreateObraRequest
): Promise<ObraResponse> => {
    try {
        const response = await apiClient.post<ObraResponse>(
            'v1/obras/',  // ← Barra final agregada
            obraData
        )
        return response.data
    } catch (error: any) {
        console.error('Error al crear la obra:', error)
        throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            'Error al crear la obra'
        )
    }
}

// PUT - Actualizar una obra existente
export const editObra = async (
    obraData: UpdateObraRequest
): Promise<ObraResponse> => {
    try {
        const { id, ...data } = obraData
        const response = await apiClient.put<ObraResponse>(
            `v1/obras/${id}/`,  // ← Barra final agregada
            data
        )
        return response.data
    } catch (error: any) {
        console.error('Error al actualizar la obra:', error)
        throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            'Error al actualizar la obra'
        )
    }
}

// DELETE - Eliminar una obra
export const deleteObra = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`v1/obras/${id}/`)  // ← Barra final agregada
    } catch (error: any) {
        console.error('Error al eliminar la obra:', error)
        throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            'Error al eliminar la obra'
        )
    }
}
