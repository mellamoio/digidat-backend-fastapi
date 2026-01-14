import type { MimeTypeInfo, ValidationResult } from "../types/documentos";


export const getMimeTypeInfo = (mimeType: string): MimeTypeInfo => {
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
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const validateModalProps = (props: {
  tipo: string;
  id_informacionfinancista?: number;
  id_informacioncontratista?: number;
}): ValidationResult => {
  const { tipo, id_informacionfinancista, id_informacioncontratista } = props;

  if (id_informacionfinancista != null && id_informacioncontratista != null) {
    return {
      isValid: false,
      error: "No se pueden pasar id_informacionfinancista e id_informacioncontratista simultáneamente",
    };
  }

  if (tipo === "financista" && id_informacionfinancista == null) {
    return {
      isValid: false,
      error: "El tipo 'financista' requiere id_informacionfinancista",
    };
  }

  if (tipo === "contratista" && id_informacioncontratista == null) {
    return {
      isValid: false,
      error: "El tipo 'contratista' requiere id_informacioncontratista",
    };
  }

  if (tipo === "financista" && id_informacioncontratista != null) {
    return {
      isValid: false,
      error: "El tipo 'financista' no debe recibir id_informacioncontratista",
    };
  }

  if (tipo === "contratista" && id_informacionfinancista != null) {
    return {
      isValid: false,
      error: "El tipo 'contratista' no debe recibir id_informacionfinancista",
    };
  }

  return { isValid: true };
};

export const isValidFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
};

export const isValidFileSize = (bytes: number, maxSizeMB: number): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return bytes <= maxBytes;
};

export const truncateFileName = (filename: string, maxLength: number = 20): string => {
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.split(".").pop() || "";
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf("."));
  const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
  
  return `${truncatedName}...${extension}`;
};

export const generateLocalFileId = (): string => {
  return `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
