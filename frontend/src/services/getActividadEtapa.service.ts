import apiClient from '../api/api'
import { DigidatRoutes, replaceRouteParams } from '../routes'
import type { ActividadEtapa } from '../types/actividad_etapa'
import { setQueryParams } from '../helpers/setQueryParams'
import { handleErrorRequest } from '../helpers/handleErrorRequest'

interface GetActividadesEtapaRequest {
  id_obra?: number
  id_estado_etapa?: number
}

interface CreateActividadEtapaRequest {
  nombre_etapa: string
  id_obra: number
  id_estado_etapa: number
  orden?: number
}

interface UpdateActividadEtapaRequest {
  id_etapa: number
  nombre_etapa?: string
  id_obra?: number
  id_estado_etapa?: number
  orden?: number
}

export const getActividadesEtapa = async (
  filters?: GetActividadesEtapaRequest
): Promise<ActividadEtapa[]> => {
  try {
    let url: string = DigidatRoutes.GET_ACTIVIDADES_ETAPA
    
    if (filters) {
      const params: Record<string, string> = {}
      if (filters.id_obra) params.id_obra = filters.id_obra.toString()
      if (filters.id_estado_etapa) params.id_estado_etapa = filters.id_estado_etapa.toString()
      url = setQueryParams(params, url)
    }
    
    const { data } = await apiClient.get<ActividadEtapa[]>(url)
    return data || []
  } catch (e) {
    throw handleErrorRequest(e)
  }
}

export const getActividadEtapaById = async (id_etapa: number): Promise<ActividadEtapa> => {
  try {
    const url = replaceRouteParams(DigidatRoutes.GET_ACTIVIDAD_ETAPA_BY_ID, { id: id_etapa })
    const { data } = await apiClient.get<ActividadEtapa>(url)
    return data
  } catch (e) {
    throw handleErrorRequest(e)
  }
}

export const inicializarActividadesObra = async (id_obra: number): Promise<{ message: string; total_actividades: number }> => {
  try {
    const response = await apiClient.post(DigidatRoutes.INICIALIZAR_ACTIVIDADES_ETAPA, { id_obra })
    return response.data
  } catch (error: any) {
    console.error('Error al inicializar actividades:', error)
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Error al inicializar las actividades'
    )
  }
}

export const createActividadEtapa = async (
  actividadData: CreateActividadEtapaRequest
): Promise<ActividadEtapa> => {
  try {
    const response = await apiClient.post<ActividadEtapa>(
      DigidatRoutes.GET_ACTIVIDADES_ETAPA,
      actividadData
    )
    return response.data
  } catch (error: any) {
    console.error('Error al crear la actividad de etapa:', error)
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Error al crear la actividad de etapa'
    )
  }
}

export const updateActividadEtapa = async (
  actividadData: UpdateActividadEtapaRequest
): Promise<ActividadEtapa> => {
  try {
    const { id_etapa, ...data } = actividadData
    const url = replaceRouteParams(DigidatRoutes.GET_ACTIVIDAD_ETAPA_BY_ID, { id: id_etapa })
    const response = await apiClient.put<ActividadEtapa>(url, data)
    return response.data
  } catch (error: any) {
    console.error('Error al actualizar la actividad de etapa:', error)
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Error al actualizar la actividad de etapa'
    )
  }
}

export const deleteActividadEtapa = async (id_etapa: number): Promise<void> => {
  try {
    const url = replaceRouteParams(DigidatRoutes.DELETE_ACTIVIDAD_ETAPA, { id: id_etapa })
    await apiClient.delete(url)
  } catch (error: any) {
    console.error('Error al eliminar la actividad de etapa:', error)
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Error al eliminar la actividad de etapa'
    )
  }
}