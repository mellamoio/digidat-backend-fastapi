import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { FaFilePdf, FaFileImage } from "react-icons/fa";
import type { FileObject } from "../../../../types/pagos";
import * as S from "./ModalVistaPrevia.styled";

const FilePreview = ({ selectedFile }: { selectedFile: FileObject | null }) => {
  const [previewError, setPreviewError] = useState<string | null>(null);

  if (!selectedFile) {
    return <p>No hay archivo seleccionado</p>;
  }

  const fileUrl = selectedFile.file && selectedFile.file.size > 0 ? URL.createObjectURL(selectedFile.file) : null;
  const sourceUrl = selectedFile.url || fileUrl;

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handlePreviewError = (error: React.SyntheticEvent) => {
    console.error("[FilePreview] Error cargando el visor:", {
      sourceUrl,
      error: error.type,
      details: error,
      nombre_original: selectedFile.nombre_original,
    });
    setPreviewError("No se pudo cargar el archivo en el visor. Por favor, intenta abrirlo o descargarlo.");
  };

  if (!sourceUrl || !selectedFile.nombre_original) {
    return (
      <div style={{ textAlign: "center" }}>
        <p>Archivo inválido o no disponible para previsualización.</p>
        <p>Nombre del archivo: {selectedFile.nombre_original || "Desconocido"}</p>
      </div>
    );
  }

  const ext = selectedFile.nombre_original?.split(".").pop()?.toLowerCase() || "";
  const esImagen = ["jpg", "jpeg", "png", "gif"].includes(ext);
  const esPDF = ext === "pdf";

  const encodedSourceUrl = encodeURI(sourceUrl);

  if (esImagen) {
    return (
      <img
        src={encodedSourceUrl}
        alt={selectedFile.nombre_original}
        style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
        onError={handlePreviewError}
      />
    );
  }

  if (esPDF) {
    const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodedSourceUrl}&embedded=true`;

    return (
      <div style={{ textAlign: "center", height: "500px" }}>
        {previewError ? (
          <>
            <p>{previewError}</p>
            <a href={encodedSourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#722AE9" }}>
              Descargar archivo
            </a>
          </>
        ) : (
          <>
            <iframe
              src={googleDocsViewerUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title={`PDF: ${selectedFile.nombre_original}`}
              onError={handlePreviewError}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allow="fullscreen; encrypted-media"
              referrerPolicy="no-referrer"
            />
            <Button
              onClick={() => window.open(encodedSourceUrl, "_blank")}
              style={{ marginTop: "10px" }}
            >
              Abrir PDF en nueva pestaña
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p>Vista previa no disponible para este tipo de archivo.</p>
      <a href={encodedSourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#722AE9" }}>
        Descargar archivo
      </a>
    </div>
  );
};

const getFileIcon = (fileName: string | undefined) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <FaFilePdf />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage />;
    default:
      return <FaFilePdf />;
  }
};

interface ModalVistaPreviaProps {
  visible: boolean;
  files: FileObject[];
  onClose: () => void;
  onRemoveFile: (index: number) => void;
}

const ModalVistaPrevia = ({ visible, files, onClose, onRemoveFile }: ModalVistaPreviaProps) => {
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [fileList, setFileList] = useState<FileObject[]>([]);

  useEffect(() => {
    const uniqueFiles = Array.from(
      new Map(files.map((file) => [file.id || file.url || `temp_${Date.now()}`, file])).values()
    );
    setFileList(uniqueFiles);
    if (visible && uniqueFiles.length > 0) {
      setSelectedFile(uniqueFiles[0]);
    } else {
      setSelectedFile(null);
    }
  }, [files, visible]);

  const handleRemoveFile = (index: number) => {
    onRemoveFile(index);
    const updatedFiles = fileList.filter((_, i) => i !== index);
    setFileList(updatedFiles);
    if (updatedFiles.length > 0) {
      setSelectedFile(updatedFiles[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleDownload = () => {
    if (selectedFile?.url) {
      const link = document.createElement("a");
      link.href = selectedFile.url;
      link.download = selectedFile.nombre_original || "archivo";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (selectedFile?.file && selectedFile.file.size > 0) {
      const url = URL.createObjectURL(selectedFile.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedFile.nombre_original || "archivo";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!visible) return null;

  return (
    <S.ModalOverlay>
      <S.ModalContainer>
        <S.ModalHeader>
          <S.ModalTitle>Vista Previa</S.ModalTitle>
          <S.CloseButton onClick={onClose}>×</S.CloseButton>
        </S.ModalHeader>
        <S.ModalBody>
          <S.PreviewContainer>
            {fileList.length > 0 ? (
              selectedFile ? (
                <FilePreview selectedFile={selectedFile} />
              ) : (
                <p>No hay archivo seleccionado</p>
              )
            ) : (
              <p>No hay documentos disponibles</p>
            )}
          </S.PreviewContainer>
          <S.FileListContainer>
            {fileList.map((fileObj, index) => (
              <S.FileItem
                key={`${fileObj.id || 'temp'}-${index}`}
                isSelected={selectedFile?.id === fileObj.id}
                onClick={() => setSelectedFile(fileObj)}
              >
                <S.FileIconContainer>
                  <S.FileIcon>{getFileIcon(fileObj.nombre_original)}</S.FileIcon>
                </S.FileIconContainer>
                <S.FileNameContainer>
                  <S.FileName>{fileObj.nombre_original || "Archivo desconocido"}</S.FileName>
                </S.FileNameContainer>
                <S.RemoveButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                />
              </S.FileItem>
            ))}
          </S.FileListContainer>
        </S.ModalBody>
        <S.Footer>
          <Button onClick={onClose}>Cancelar</Button>
          {selectedFile && (selectedFile.url || (selectedFile.file && selectedFile.file.size > 0)) && (
            <Button type="primary" onClick={handleDownload} style={{ background: "#722AE9", borderColor: "#722AE9" }}>
              Descargar
            </Button>
          )}
        </S.Footer>
      </S.ModalContainer>
    </S.ModalOverlay>
  );
};

export default ModalVistaPrevia;