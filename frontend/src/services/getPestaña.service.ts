import apiClient from "../api/api";
import type { Pestaña } from "../types/pestaña";

const ID_EMPRESA = 1;

export const getPestaña = async (): Promise<Pestaña[]> => {
    const response = await apiClient.get(`/all/pestavista?id_empresa=${ID_EMPRESA}`);
    if (response.data && response.data.success) {
        return response.data.data;
    }
    throw new Error("Error al obtener las pestañas de vista");
};

export const guardarPestañasVista = async (data: Pestaña[]): Promise<void> => {
    const dataToSave = data.map((item) => ({
        id: item.id,
        name: item.name,
        habilitardeshabilitar: item.habilitardeshabilitar,
    }));

    try {
        const response = await apiClient.post(`/edit/pestavista?id_empresa=${ID_EMPRESA}`, dataToSave[0]);

        const responseData = response.data;

        if (
            (typeof responseData === "string" && responseData.includes("Succeccfully")) ||
            (responseData?.message && responseData.message.includes("Succeccfully")) ||
            (responseData?.success === true)
        ) {
            return;
        }

        throw new Error(
            responseData?.message || "Error al guardar las pestañas de vista"
        );
    } catch (error: any) {
        console.error("Error en la solicitud POST:", error.response?.data || error.message);
        throw error;
    }
};