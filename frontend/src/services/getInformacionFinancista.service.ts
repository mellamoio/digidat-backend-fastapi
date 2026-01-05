import apiClient from "../api/api";
import { handleErrorRequest } from "../helpers/handleErrorRequest";

export interface FinancistaData {
    id: number;
    id_tipo_financista: number;
    aspecto: string;
    comentarios: string;
    id_categoria_documento: { id: number; nombre: string }[];
    responsables: { id: number; nombre: string }[];
    id_empresa: number;
    id_obra_impuesto: number;
}

export interface ApiResponse {
    success: boolean;
    data: FinancistaData[];
}

export const fetchInformacionFinancista = async (
    id_empresa: number = 1,
    id_obra_impuesto: number
): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get<ApiResponse>("/all/informacionfinancista", {
            params: { id_empresa, id_obra_impuesto },
        });
        return response.data;
    } catch (error: any) {
        console.error("[fetchInformacionFinancista] Error:", error);
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};

export const sendFinancista = async (
    data: FinancistaData,
    id_obra_impuesto: number,
    id?: number
): Promise<FinancistaData> => {
    try {
        const payload = { ...data, id_obra_impuesto };
        if (id) {
            const response = await apiClient.post<FinancistaData>(
                "/edit/informacionfinancista",
                { ...payload, id },
                { params: { id, id_obra_impuesto } }
            );
            return response.data;
        } else {
            const response = await apiClient.post<FinancistaData>(
                "/add/informacionfinancista",
                payload,
                { params: { id_obra_impuesto } }
            );
            return response.data;
        }
    } catch (error: any) {
        console.error("[sendFinancista] Error:", error);
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};

export const deleteFinancista = async (
    id: number,
    id_obra_impuesto: number
): Promise<void> => {
    try {
        await apiClient.post("/delete/informacionfinancista", { id, id_obra_impuesto });
    } catch (error: any) {
        console.error("[deleteFinancista] Error:", error);
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};