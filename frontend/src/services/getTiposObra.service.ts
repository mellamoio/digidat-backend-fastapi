import apiClient from '../api/api'

export interface TipoObra {
  id: number;
  nombre: string;
  descripcion: string;
}

export const getTiposObra = async (): Promise<TipoObra[]> => {
  const { data } = await apiClient.get<TipoObra[]>("v1/tipos-obra");
  return data;
};
