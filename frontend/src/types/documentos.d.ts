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

export interface DocumentoConPreview extends DocumentoResponse {
  previewUrl?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface MimeTypeInfo {
  esImagen: boolean;
  esPDF: boolean;
  esWord: boolean;
  esExcel: boolean;
  esTxt: boolean;
  esZip: boolean;
}