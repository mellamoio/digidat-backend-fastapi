import api from "../api/api";
import { handleErrorRequest } from "../helpers/handleErrorRequest";
import { DigidatRoutes } from "../routes";
import type {
    FinancistaData,
    FinancistaDataCreate,
    FinancistaApiResponse,
    FinancistaSingleResponse
} from "../types/informacion_financista";

export const fetchInformacionFinancista = async (
    id_obra: number
): Promise<FinancistaApiResponse> => {
    try {
        
        const response = await api.get<FinancistaApiResponse>(
            DigidatRoutes.GET_INFORMACION_FINANCISTA,
            {
                params: { id_obra },
            }
        );
        
        
        return response.data;
    } catch (error: any) {
        console.error("[fetchInformacionFinancista] Error:", error);
        console.error("Error response:", error.response?.data);
        
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};


export const sendFinancista = async (
    data: FinancistaDataCreate,
    id?: number
): Promise<FinancistaData> => {
    try {
        
        if (id) {
            const url = DigidatRoutes.UPDATE_INFORMACION_FINANCISTA.replace(':id', id.toString());
            const response = await api.put<FinancistaData>(url, data);
            
            return (response.data as any).data || response.data;
        } else {
            const response = await api.post<FinancistaData>(
                DigidatRoutes.CREATE_INFORMACION_FINANCISTA,
                data
            );
            
            return (response.data as any).data || response.data;
        }
    } catch (error: any) {
        console.error("[sendFinancista] Error:", error);
        console.error("❌ Error detail:", error.response?.data);
        
        if (error.response?.status === 422) {
            const detail = error.response?.data?.detail;
            console.error("Validation errors:", detail);
            throw new Error(`Datos inválidos: ${JSON.stringify(detail)}`);
        }
        
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        
        throw handleErrorRequest(error);
    }
};


export const deleteFinancista = async (id: number): Promise<void> => {
    try {
        const url = DigidatRoutes.DELETE_INFORMACION_FINANCISTA.replace(':id', id.toString());
        await api.delete(url);
    } catch (error: any) {
        console.error("[deleteFinancista] Error:", error);
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};