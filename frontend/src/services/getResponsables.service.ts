
import { api } from "../api/api";
import { handleErrorRequest } from "../helpers/handleErrorRequest";
import { DigidatRoutes } from '../routes'

export interface Responsable {
  id: string;
  nombres: string;
  nombre: string;
}

export const getResponsables = async (): Promise<Responsable[]> => {
  try {
    const { data } = await api.get<Responsable[]>(DigidatRoutes.GET_RESPONSABLES);
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un array de responsables");
    }
    return data;
  } catch (e) {
    console.error("Error en getResponsables:", e);
    throw new Error(handleErrorRequest(e));
  }
};