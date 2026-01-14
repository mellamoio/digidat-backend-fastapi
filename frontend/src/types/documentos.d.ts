// src/types/documentos.ts

export interface DocumentoResponse {
  id_documento: number;
  nombre: string;
  ruta: string;
  mime_type: string;
  tamano_bytes: number;
  uploaded_by?: number;
  id_obra?: number;
  id_etapa?: number;
  id_informacionfinancista?: number;
  id_informacioncontratista?: number;
  id_pago?: number;
  create_date: string;
  update_date?: string;
  delete_date?: string;
}

export interface DocumentoUrlResponse {
  id_documento: number;
  nombre: string;
  url: string;
  expires_in: number;
}

export interface GetDocumentosParams {
  id_obra?: number;
  id_etapa?: number;
  id_informacionfinancista?: number;
  id_informacioncontratista?: number;
  id_pago?: number;
}

export interface UploadDocumentoParams {
  id_obra?: number;
  id_etapa?: number;
  id_informacionfinancista?: number;
  id_informacioncontratista?: number;
  id_pago?: number;
}

export interface ModalDocumentoProps {
  categoria: string;
  tipo: string;
  actividadId?: number;
  requerimientoId?: number;
  carpetaBase?: string;
  onClose: () => void;
  onDocumentsSaved?: (documentos: { file: File; url: string; id: number }[]) => void;
  codigoRegistro?: number;
  id_obra?: number | null;
  categoriaId?: number;
  id_etapa?: number;
  id_informacionfinancista?: number;
  id_informacioncontratista?: number;
  id_pago?: number;
}

// =====================================
// HELPERS
// =====================================

/**
 * Construye parámetros de subida filtrando valores null/undefined
 */
export const buildUploadParams = (props: {
  id_obra?: number | null;
  id_etapa?: number;
  id_informacionfinancista?: number;
  id_informacioncontratista?: number;
  id_pago?: number;
}): UploadDocumentoParams => {
  const params: UploadDocumentoParams = {};
  
  if (props.id_obra != null) params.id_obra = props.id_obra;
  if (props.id_etapa != null) params.id_etapa = props.id_etapa;
  if (props.id_informacionfinancista != null) params.id_informacionfinancista = props.id_informacionfinancista;
  if (props.id_informacioncontratista != null) params.id_informacioncontratista = props.id_informacioncontratista;
  if (props.id_pago != null) params.id_pago = props.id_pago;
  
  return params;
};

/**
 * Construye parámetros de consulta filtrando valores null/undefined
 */
export const buildGetDocumentosParams = (props: {
  id_obra?: number | null;
  id_etapa?: number;
  id_informacionfinancista?: number;
  id_informacioncontratista?: number;
  id_pago?: number;
}): GetDocumentosParams => {
  const params: GetDocumentosParams = {};
  
  if (props.id_obra != null) params.id_obra = props.id_obra;
  if (props.id_etapa != null) params.id_etapa = props.id_etapa;
  if (props.id_informacionfinancista != null) params.id_informacionfinancista = props.id_informacionfinancista;
  if (props.id_informacioncontratista != null) params.id_informacioncontratista = props.id_informacioncontratista;
  if (props.id_pago != null) params.id_pago = props.id_pago;
  
  return params;
};

export const getMimeTypeInfo = (mimeType: string) => {
  return {
    esImagen: mimeType.startsWith("image/"),
    esPDF: mimeType === "application/pdf",
    esWord: mimeType.includes("word") || mimeType.includes("document"),
    esExcel: mimeType.includes("excel") || mimeType.includes("spreadsheet"),
    esTxt: mimeType === "text/plain",
    esZip: mimeType.includes("zip") || mimeType.includes("rar"),
  };
};

export const getMimeTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
  if (mimeType.includes("zip") || mimeType.includes("rar")) return "📦";
  return "📎";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};