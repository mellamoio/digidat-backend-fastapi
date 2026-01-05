import api from "../api/api";
import { handleErrorRequest } from "../helpers/handleErrorRequest";

export interface ContratistaData {
    id?: number;
    id_tipo_contratista: number;
    aspecto: string;
    comentarios: string;
    id_categoria_documento: { id: number; nombre: string }[];
    responsables: { id: number; nombre: string }[];
    id_empresa: number;
    id_obra_impuesto: number;
}

export interface ApiResponse {
    success?: boolean;
    data?: ContratistaData | ContratistaData[];
    message?: string;
    obra_id?: number;
}

export const fetchInformacionContratista = async (
    id_empresa: number = 1,
    id_obra_impuesto: number
): Promise<ApiResponse> => {
    try {
        const response = await api.get<ApiResponse>("/all/informacioncontratista", {
            params: { id_empresa, id_obra_impuesto },
        });
        return response.data;
    } catch (error: any) {
        console.error("[fetchInformacionContratista] Error:", error);
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};

export const sendContratista = async (
    data: ContratistaData,
    id_obra_impuesto: number,
    id?: number
): Promise<ContratistaData> => {
    try {
        const payload = { ...data, id_obra_impuesto };

        let response;
        if (id) {
            response = await api.post("/edit/informacioncontratista", {
                ...payload,
                id,
            }, {
                params: { id, id_obra_impuesto }
            });
        } else {
            response = await api.post("/add/informacioncontratista", payload, {
                params: { id_obra_impuesto }
            });
        }

        let result: ContratistaData;
        if ("success" in response.data && response.data.success !== undefined) {
            if (!response.data.success) {
                throw new Error(response.data.message || "Error en la API: success es false");
            }
            if (!response.data.data || typeof response.data.data !== "object") {
                throw new Error("La API no devolvió datos válidos en la propiedad 'data'");
            }
            result = response.data.data as ContratistaData;
        } else if ("id" in response.data || "id_tipo_contratista" in response.data) {
            result = response.data as ContratistaData;
        } else if ("message" in response.data && response.data.message?.includes("ingresado con éxito")) {
            console.warn("[sendContratista] Respuesta no contiene datos del contratista, recargando...");
            const updatedData = await fetchInformacionContratista(data.id_empresa, id_obra_impuesto);
            if (!updatedData.success || !Array.isArray(updatedData.data)) {
                throw new Error("No se pudieron recargar los datos del contratista");
            }
            const newContratista = updatedData.data.find(
                (item) => item.aspecto === data.aspecto && item.id_tipo_contratista === data.id_tipo_contratista
            );
            if (!newContratista) {
                throw new Error("No se encontró el contratista recién creado en los datos recargados");
            }
            result = newContratista as ContratistaData;
        } else {
            throw new Error("Formato de respuesta de la API no reconocido");
        }

        if (!result.id_tipo_contratista || !result.aspecto || !result.id_obra_impuesto) {
            console.warn("[sendContratista] Respuesta incompleta:", result);
            throw new Error("La respuesta de la API no contiene todos los campos requeridos");
        }

        if (id && !result.id) {
            result.id = id;
        }

        return result;
    } catch (error: any) {
        console.error("[sendContratista] Error detallado:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw new Error(error.message || "Error al enviar los datos del contratista");
    }
};

export const deleteContratista = async (
    id: number,
    id_obra_impuesto: number
): Promise<void> => {
    try {
        await api.post("/delete/informacioncontratista", { id, id_obra_impuesto });
    } catch (error: any) {
        console.error("[deleteContratista] Error:", error);
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};