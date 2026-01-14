// src/services/documentos.service.ts
import apiClient from "../api/api";
import type { 
  DocumentoResponse, 
  DocumentoUrlResponse,
  UploadDocumentoParams,
  GetDocumentosParams 
} from "../types/documentos";

export const obtenerDocumentos = async (
  params: GetDocumentosParams
): Promise<DocumentoResponse[]> => {
  try {
    const res = await apiClient.get<DocumentoResponse[]>("v1/documents/", { 
      params 
    });
    return res.data;
  } catch (error: any) {
    console.error("[obtenerDocumentos] Error:", error);
    throw error;
  }
};


export const subirDocumento = async (
  file: File,
  params: UploadDocumentoParams
): Promise<DocumentoResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("nombre", file.name);

  if (params.id_obra) formData.append("id_obra", params.id_obra.toString());
  if (params.id_etapa) formData.append("id_etapa", params.id_etapa.toString());
  if (params.id_informacionfinancista) {
    formData.append("id_informacionfinancista", params.id_informacionfinancista.toString());
  }
  if (params.id_informacioncontratista) {
    formData.append("id_informacioncontratista", params.id_informacioncontratista.toString());
  }
  if (params.id_pago) formData.append("id_pago", params.id_pago.toString());

  try {
    const res = await apiClient.post<DocumentoResponse>(
      "v1/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error("[subirDocumento] Error:", file.name, error);
    throw error;
  }
};

export const obtenerUrlDocumento = async (
  idDocumento: number,
  expiration: number = 3600
): Promise<string> => {
  try {
    const res = await apiClient.get<DocumentoUrlResponse>(
      `v1/documents/${idDocumento}/url`,
      {
        params: { expiration }
      }
    );
    return res.data.url;
  } catch (error: any) {
    console.error("[obtenerUrlDocumento] Error:", error);
    throw error;
  }
};

export const eliminarDocumento = async (idDocumento: number): Promise<void> => {
  try {
    await apiClient.delete(`v1/documents/${idDocumento}`);
  } catch (error: any) {
    console.error("[eliminarDocumento] Error:", error);
    throw error;
  }
};

export const descargarDocumento = async (
  idDocumento: number,
  expiration: number = 3600
): Promise<void> => {
  try {
    const url = await obtenerUrlDocumento(idDocumento, expiration);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.error("[descargarDocumento] Error:", error);
    throw error;
  }
};