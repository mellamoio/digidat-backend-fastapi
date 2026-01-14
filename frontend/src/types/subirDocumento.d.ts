export type {
  DocumentoResponse,
  DocumentoUrlResponse,
  ModalDocumentoProps,
  GetDocumentosParams,
  UploadDocumentoParams
} from './documentos';

export { 
  getMimeTypeInfo,
  getMimeTypeIcon,
  formatFileSize,
  formatDate,
  buildUploadParams,
  buildGetDocumentosParams
} from './documentos';

export interface Archivo {
  id: number;
  url: string;
  nombre_original: string;
  esImagen: boolean;
  esPDF: boolean;
}

export interface SubirArchivoResponse {
  path: string;
}
