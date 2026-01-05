import api from "../api/api";

interface TipoInformacion {
  id: number;
  name: string;
  id_empresa?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export const getTiposFinancista = async (id_empresa: number): Promise<TipoInformacion[]> => {
  try {
    const response = await api.get("/all/tipofinancista", {
      params: { id_empresa },
    });
    if (!response.data.success || !Array.isArray(response.data.data)) {
      console.warn("[getTiposFinancista] Respuesta no válida:", response.data);
      return [];
    }
    return response.data.data;
  } catch (error: any) {
    console.error("[getTiposFinancista] Error fetching tipos financista:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};

export const getTiposContratista = async (id_empresa: number): Promise<TipoInformacion[]> => {
  try {
    const response = await api.get("/all/tipocontratista", {
      params: { id_empresa },
    });
    if (!response.data.success || !Array.isArray(response.data.data)) {
      console.warn("[getTiposContratista] Respuesta no válida:", response.data);
      return [];
    }
    return response.data.data;
  } catch (error: any) {
    console.error("[getTiposContratista] Error fetching tipos contratista:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return [];
  }
};