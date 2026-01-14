import api from "../api/api";
import { handleErrorRequest } from "../helpers/handleErrorRequest";
import { DigidatRoutes } from "../routes";
import type {
    ContratistaData,
    ContratistaDataCreate,
    ContratistaApiResponse} from "../types/informacion_contratista";

export const fetchInformacionContratista = async (
    id_obra: number
): Promise<ContratistaApiResponse> => {
    try {
        
        const response = await api.get<ContratistaApiResponse>(
            DigidatRoutes.GET_INFORMACION_CONTRATISTA,
            {
                params: { id_obra },
            }
        );
        
        return response.data;
    } catch (error: any) {
        console.error("[fetchInformacionContratista] Error:", error);
        console.error("Error response:", error.response?.data);
        
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};


export const sendContratista = async (
    data: ContratistaDataCreate,
    id?: number
): Promise<ContratistaData> => {
    try {
        
        if (id) {
            const url = DigidatRoutes.UPDATE_INFORMACION_CONTRATISTA.replace(':id', id.toString());
            const response = await api.put<ContratistaData>(url, data);
            
            return (response.data as any).data || response.data;
        } else {
            const response = await api.post<ContratistaData>(
                DigidatRoutes.CREATE_INFORMACION_CONTRATISTA,
                data
            );
            
            return (response.data as any).data || response.data;
        }
    } catch (error: any) {
        console.error("[sendContratista] Error:", error);
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


export const deleteContratista = async (id: number): Promise<void> => {
    try {
        const url = DigidatRoutes.DELETE_INFORMACION_CONTRATISTA.replace(':id', id.toString());
        await api.delete(url);
    } catch (error: any) {
        console.error("[deleteContratista] Error:", error);
        if (error.response?.status === 403) {
            throw new Error("Acceso denegado: Verifica tus permisos o token de autenticación.");
        }
        throw handleErrorRequest(error);
    }
};