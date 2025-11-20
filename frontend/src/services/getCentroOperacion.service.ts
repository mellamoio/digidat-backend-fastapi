import apiClient from '../api/api'

export interface CentroOperacion {
  id: number;
  nombre: string;
}

class CentroOperacionService {
  async getCentrosOperacion(): Promise<CentroOperacion[]> {
    try {
      const response = await apiClient.get('v1/centros-operacion/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener centros de operación:', error);
      throw error;
    }
  }

  async createCentroOperacion(nombre: string): Promise<CentroOperacion> {
    try {
      const response = await apiClient.post('v1/centros-operacion/', { nombre });
      return response.data;
    } catch (error) {
      console.error('Error al crear centro de operación:', error);
      throw error;
    }
  }
}

export const centroOperacionService = new CentroOperacionService();

export const getCentrosOperacion = () => centroOperacionService.getCentrosOperacion();
export const createCentroOperacion = (nombre: string) => centroOperacionService.createCentroOperacion(nombre);