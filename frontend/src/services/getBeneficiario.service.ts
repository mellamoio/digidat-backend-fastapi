import api from "../api/api";
import { handleErrorRequest } from "../helpers/handleErrorRequest";
import type {
  Beneficiario,
  BeneficiarioCreate,
  BeneficiarioUpdate,
  BeneficiarioApiResponse
} from "../types/beneficiario";

export const fetchBeneficiarios = async (
  skip: number = 0,
  limit: number = 100
): Promise<Beneficiario[]> => {
  try {
    
    const response = await api.get<Beneficiario[]>("v1/beneficiarios/", {
      params: { skip, limit },
    });
    
    if (!Array.isArray(response.data)) {
      console.error("[fetchBeneficiarios] La respuesta no es un array:", response.data);
      return [];
    }
    
    return response.data;
  } catch (error: any) {
    console.error("[fetchBeneficiarios] ❌ Error completo:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url
    });
    
    if (error.response?.status === 403) {
      throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
    }
    if (error.response?.status === 404) {
      throw new Error("Endpoint de beneficiarios no encontrado. URL: " + error.config?.url);
    }
    if (error.response?.status === 401) {
      throw new Error("No autenticado. Por favor inicia sesión nuevamente.");
    }
    throw handleErrorRequest(error);
  }
};

export const fetchBeneficiarioById = async (
  id: number
): Promise<Beneficiario> => {
  try {
    const response = await api.get<Beneficiario>(`v1/beneficiarios/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("[fetchBeneficiarioById] Error:", error);
    if (error.response?.status === 404) {
      throw new Error("Beneficiario no encontrado");
    }
    if (error.response?.status === 403) {
      throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
    }
    throw handleErrorRequest(error);
  }
};

export const sendBeneficiario = async (
  data: BeneficiarioCreate | BeneficiarioUpdate,
  id?: number
): Promise<Beneficiario> => {
  try {
    let response;
    
    if (id) {
      response = await api.put<BeneficiarioApiResponse | Beneficiario>(
        `v1/beneficiarios/${id}`,
        data
      );
    } else {
      response = await api.post<BeneficiarioApiResponse | Beneficiario>(
        "v1/beneficiarios/",
        data
      );
    }

    let result: Beneficiario;

    if ("success" in response.data && response.data.success !== undefined) {
      if (!response.data.success) {
        throw new Error(response.data.message || "Error en la API: success es false");
      }
      if (!response.data.data || typeof response.data.data !== "object") {
        throw new Error("La API no devolvió datos válidos en la propiedad 'data'");
      }
      result = response.data.data as Beneficiario;
    } else if ("id_beneficiario" in response.data) {
      result = response.data as Beneficiario;
    } else if ("message" in response.data && response.data.message?.includes("éxito")) {
      console.warn("[sendBeneficiario] Respuesta no contiene datos del beneficiario, recargando...");
      const updatedData = await fetchBeneficiarios();
      const newBeneficiario = updatedData.find(
        (item) => item.nombre === (data as BeneficiarioCreate).nombre
      );
      if (!newBeneficiario) {
        throw new Error("No se encontró el beneficiario recién creado en los datos recargados");
      }
      result = newBeneficiario;
    } else {
      throw new Error("Formato de respuesta de la API no reconocido");
    }

    if (!result.nombre || !result.id_beneficiario) {
      console.warn("[sendBeneficiario] Respuesta incompleta:", result);
      throw new Error("La respuesta de la API no contiene todos los campos requeridos");
    }

    if (id && !result.id_beneficiario) {
      result.id_beneficiario = id;
    }

    return result;
  } catch (error: any) {
    console.error("[sendBeneficiario] Error detallado:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    if (error.response?.status === 403) {
      throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
    }
    if (error.response?.status === 404) {
      throw new Error("Beneficiario no encontrado");
    }
    throw new Error(error.message || "Error al enviar los datos del beneficiario");
  }
};

export const deleteBeneficiario = async (id: number): Promise<void> => {
  try {
    await api.delete(`v1/beneficiarios/${id}`);
  } catch (error: any) {
    console.error("[deleteBeneficiario] Error:", error);
    if (error.response?.status === 404) {
      throw new Error("Beneficiario no encontrado");
    }
    if (error.response?.status === 403) {
      throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
    }
    throw handleErrorRequest(error);
  }
};