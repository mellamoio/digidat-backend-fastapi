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
  
  export interface FormularioSubirDocumentosProps {
    categoria?: string;
    tipo: string;
    actividadId?: number;
    requerimientoId?: number;
    isCategoriaDisabled?: boolean;
    carpetaBase?: string;
    onClose: () => void;
    onDocumentsSaved?: (nuevosDocumentos: { file: File; url: string }[]) => void;
    codigoRegistro?: number;
    categoriasDisponibles?: { id: string; nombre: string }[];
  }