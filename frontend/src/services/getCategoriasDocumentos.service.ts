
import { api } from "../api/api";
import { handleErrorRequest } from "../helpers/handleErrorRequest";
import { DigidatRoutes } from '../routes'

export interface CategoriaDocumento {
  id: number;
  nombre: string;
  descripcion: string;
}

export const getCategoriasDocumentos = async (): Promise<CategoriaDocumento[]> => {
  try {
    const { data } = await api.get<CategoriaDocumento[]>(DigidatRoutes.GET_CATEGORIAS_DOCUMENTOS);
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un array de categorías de documentos");
    }
    return data;
  } catch (e) {
    console.error("Error en getCategoriasDocumentos:", e);
    throw new Error(handleErrorRequest(e));
  }
};