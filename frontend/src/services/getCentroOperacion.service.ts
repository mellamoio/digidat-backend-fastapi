import apiClient from '../api/api'

export interface CentroOperacion {
  id: number;
  nombre: string;
}

class CentroOperacionService {
  async getCentrosOperacion(): Promise<CentroOperacion[]> {
    const response = await apiClient.get('v1/centros-operacion');
    return response.data;
  }

  async createCentroOperacion(nombre: string): Promise<CentroOperacion> {
    const response = await apiClient.post('v1/centros-operacion', { nombre });
    return response.data;
  }
}

export const centroOperacionService = new CentroOperacionService();
