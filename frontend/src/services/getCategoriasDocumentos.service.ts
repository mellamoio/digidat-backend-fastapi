import apiClient from "../api/api";
import { DigidatRoutes } from "../routes";

export interface CategoriaDocumento {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  fecha_creacion: string;
}

export const fetchCategoriasDocumento = async (): Promise<CategoriaDocumento[]> => {
  try {
    const response = await apiClient.get(DigidatRoutes.GET_CATEGORIAS_DOCUMENTOS);
    return response.data || [];
  } catch (error: any) {
    console.error("[fetchCategoriasDocumento] Error:", error);
    throw new Error(error.response?.data?.detail || "Error al obtener categorías");
  }
};