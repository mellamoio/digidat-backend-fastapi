import apiClient from "../api/api";

export interface CategoriaDocumento {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  fecha_creacion: string;
}

export const fetchCategoriasDocumento = async (): Promise<CategoriaDocumento[]> => {
  try {
    const response = await apiClient.get("v1/categorias-documento/");
    return response.data || [];
  } catch (error: any) {
    console.error("[fetchCategoriasDocumento] Error:", error);
    throw new Error(error.response?.data?.detail || "Error al obtener categorías");
  }
};
