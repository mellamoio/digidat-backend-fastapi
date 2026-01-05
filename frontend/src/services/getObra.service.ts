import { handleErrorRequest } from '../helpers/handleErrorRequest'
import type { Obra } from '../types/obra'
import apiClient from '../api/api'

interface CreateObraRequest {
  nombre: string
  tipo_id: number
  id_responsable: number
  fecha_inicio?: string | null
  fecha_fin?: string | null
  costo_proyecto?: number
  centros_operacion: number[]
}

interface UpdateObraRequest {
  id_obra: number
  nombre?: string
  tipo_id?: number
  id_responsable?: number
  fecha_inicio?: string | null
  fecha_fin?: string | null
  costo_proyecto?: number
  centros_operacion?: number[]
}

export const getObra = async (): Promise<Obra[]> => {
  try {
    const { data } = await apiClient.get<Obra[]>('v1/obras/')
    return data || []
  } catch (e) {
    throw handleErrorRequest(e)
  }
}

export const getObraById = async (id_obra: number): Promise<Obra> => {
  try {
    const { data } = await apiClient.get<Obra>(`v1/obras/${id_obra}`)
    return data
  } catch (e) {
    throw handleErrorRequest(e)
  }
}

export const createObra = async (
  obraData: CreateObraRequest
): Promise<Obra> => {
  try {
    const response = await apiClient.post<Obra>(
      'v1/obras/',
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

export const editObra = async (
  obraData: UpdateObraRequest
): Promise<Obra> => {
  try {
    const { id_obra, ...data } = obraData
    const response = await apiClient.put<Obra>(
      `v1/obras/${id_obra}`,
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

export const deleteObra = async (id_obra: number): Promise<void> => {
  try {
    await apiClient.delete(`v1/obras/${id_obra}`)
  } catch (error: any) {
    console.error('Error al eliminar la obra:', error)
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Error al eliminar la obra'
    )
  }
}
