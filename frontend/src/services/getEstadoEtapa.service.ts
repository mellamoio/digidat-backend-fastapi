import apiClient from '../api/api'
import { DigidatRoutes } from '../routes'
import type { EstadoEtapa } from '../types/estado_etapa'

export const getEstadosEtapa = async (): Promise<EstadoEtapa[]> => {
  try {
    const { data } = await apiClient.get<EstadoEtapa[]>(DigidatRoutes.GET_ESTADOS_ETAPA)
    return data
  } catch (error) {
    console.error('Error al cargar estados de etapa:', error)
    throw error
  }
}