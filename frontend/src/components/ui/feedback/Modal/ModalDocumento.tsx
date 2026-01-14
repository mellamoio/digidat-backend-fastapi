import React, { useState, useRef, useEffect } from "react";
import type { ResponseError } from "../../../../types/responses";
import {
  ModalContainer,
  Header,
  CloseButton,
  FormRow,
  FormGroup,
  Label,
  Select,
  DropZone,
  PreviewImage,
  Actions,
  Button,
} from "./ModalDocumento.styled";
import { 
  fetchCategoriasDocumento, 
  type CategoriaDocumento 
} from "../../../../services/getCategoriasDocumentos.service";
import type { ModalDocumentoProps, DocumentoConPreview } from "../../../../types/documentos";
import {
  obtenerDocumentos,
  subirDocumento,
  eliminarDocumento,
  obtenerUrlDocumento,
} from "../../../../services/getDocumentos.service";
import { buildUploadParams, buildGetDocumentosParams } from "../../../../utils/documentos.params";
import { 
  getMimeTypeInfo, 
  validateModalProps,
  generateLocalFileId 
} from "../../../../utils/documentos.utils";

import ModalVistaPrevia from "./ModalVistaPrevia";
import type { FileObject } from "../../../../types/pagos";

const ModalDocumento: React.FC<ModalDocumentoProps> = ({
  categoria,
  tipo,
  onClose,
  onDocumentsSaved,
  id_obra,
  categoriaId,
  id_etapa,
  id_informacionfinancista,
  id_informacioncontratista,
  id_pago,
}) => {
  const [archivos, setArchivos] = useState<
    { file: File; localUrl: string; nombre_original: string; id: string }[]
  >([]);
  const [archivosSubidos, setArchivosSubidos] = useState<DocumentoConPreview[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>(
    categoriaId ? categoriaId.toString() : categoria
  );
  const [categoriasDocumentos, setCategoriasDocumentos] = useState<CategoriaDocumento[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFiles, setModalFiles] = useState<FileObject[]>([]);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const tiposConCategoriaDeshabilitada = ["pago", "etapa", "contratista", "financista"];

  useEffect(() => {
    const validation = validateModalProps({
      tipo,
      id_informacionfinancista,
      id_informacioncontratista,
    });

    if (!validation.isValid) {
      console.error("⚠️ [ModalDocumento] Error de validación:", validation.error);
      setErrorMessage(validation.error || "Error de configuración del modal");
      return;
    }
    console.log("[ModalDocumento] Inicializando con parámetros:", {
      tipo,
      id_obra,
      id_etapa,
      id_informacionfinancista,
      id_informacioncontratista,
      id_pago,
    });

    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const data = await fetchCategoriasDocumento();
        setCategoriasDocumentos(data);
        setSelectedCategoria(categoriaId ? categoriaId.toString() : categoria);
      } catch (error) {
        console.error("[fetchCategorias] Error:", error);
        setCategoriasDocumentos([]);
        setErrorMessage("Error al cargar las categorías de documentos.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategorias();

    const tieneParametrosValidos = 
      id_obra || 
      id_etapa || 
      id_informacionfinancista || 
      id_informacioncontratista || 
      id_pago;

    if (tieneParametrosValidos) {
      cargarArchivos();
    } else {
      console.warn("[ModalDocumento] No hay parámetros válidos para cargar archivos");
    }

    return () => {
      archivos.forEach(({ localUrl }) => {
        if (localUrl) URL.revokeObjectURL(localUrl);
      });
    };
  }, [id_obra, id_etapa, id_informacionfinancista, id_informacioncontratista, id_pago, tipo]);

  const cargarArchivos = async () => {
    try {
      const params = buildGetDocumentosParams({
        id_obra,
        id_etapa,
        id_informacionfinancista,
        id_informacioncontratista,
        id_pago,
      });

      console.log("[cargarArchivos] Consultando documentos con params:", params);

      const documentos = await obtenerDocumentos(params);
      
      console.log(`[cargarArchivos] ${documentos.length} documentos obtenidos del servidor`);

      const documentosConPreview = await Promise.all(
        documentos.map(async (doc) => {
          const mimeInfo = getMimeTypeInfo(doc.mime_type);
          
          if (mimeInfo.esImagen || mimeInfo.esPDF) {
            try {
              const url = await obtenerUrlDocumento(doc.id_documento, 3600);
              return { ...doc, previewUrl: url };
            } catch (error) {
              console.error(`[cargarArchivos] Error obteniendo URL para ${doc.nombre}:`, error);
              return { ...doc, previewUrl: undefined };
            }
          }
          
          return { ...doc, previewUrl: undefined };
        })
      );
      
      setArchivosSubidos(documentosConPreview);
      
      documentosConPreview.forEach(doc => {
        console.log(`[cargarArchivos] Documento cargado:`, {
          id: doc.id_documento,
          nombre: doc.nombre,
          id_informacionfinancista: doc.id_informacionfinancista,
          id_informacioncontratista: doc.id_informacioncontratista,
          tienePreview: !!doc.previewUrl,
        });
      });
    } catch (error: any) {
      const err = error as ResponseError;
      console.error("[cargarArchivos] Error:", {
        status: err.response?.status,
        message: err.response?.data?.detail || err.message,
      });
      setArchivosSubidos([]);
      
      if (err.response?.status !== 404) {
        setErrorMessage("Error al cargar los archivos.");
      }
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        localUrl: URL.createObjectURL(file),
        nombre_original: file.name,
        id: generateLocalFileId(),
      }));
      setArchivos((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleGuardar = async () => {
    if (archivos.length === 0) {
      setErrorMessage("Por favor, selecciona al menos un archivo.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const params = buildUploadParams({
        id_obra,
        id_etapa,
        id_informacionfinancista,
        id_informacioncontratista,
        id_pago,
      });

      console.log("[handleGuardar] Subiendo archivos con params:", params);

      const uploadPromises = archivos.map((archivo) => 
        subirDocumento(archivo.file, params)
      );

      const uploadedDocs = await Promise.all(uploadPromises);

      console.log(`[handleGuardar] ${uploadedDocs.length} archivos subidos exitosamente`);

      if (onDocumentsSaved) {
        const nuevosDocumentos = uploadedDocs.map((doc, index) => ({
          file: archivos[index].file,
          url: doc.ruta,
          id: doc.id_documento,
        }));
        onDocumentsSaved(nuevosDocumentos);
      }

      archivos.forEach(({ localUrl }) => {
        if (localUrl) URL.revokeObjectURL(localUrl);
      });
      setArchivos([]);

      await cargarArchivos();
      setErrorMessage(null);
    } catch (error: any) {
      console.error("[handleGuardar] Error:", error);
      const errorMsg = error.response?.data?.detail || error.message || "Error desconocido";
      setErrorMessage(`Error al guardar: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    archivos.forEach(({ localUrl }) => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    });
    setArchivos([]);
    setErrorMessage(null);
    onClose();
  };

  const handleRemover = (index: number) => {
    setArchivos((prevArchivos) => {
      const updatedArchivos = prevArchivos.filter((_, i) => i !== index);
      if (prevArchivos[index]?.localUrl) {
        URL.revokeObjectURL(prevArchivos[index].localUrl);
      }
      return updatedArchivos;
    });
  };

  const handleEliminar = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await eliminarDocumento(id);
      setArchivosSubidos((prev) => prev.filter((doc) => doc.id_documento !== id));
      console.log("[handleEliminar] Documento eliminado:", id);
    } catch (error) {
      console.error("[handleEliminar] Error:", error);
      setErrorMessage("Error al eliminar el archivo.");
    }
  };

  const handleOpenPendingPreview = () => {
    const files: FileObject[] = archivos.map((archivo) => ({
      id: archivo.id,
      nombre_original: archivo.nombre_original,
      url: archivo.localUrl,
      file: archivo.file,
      esImagen: archivo.file.type.startsWith("image/"),
      esPDF: archivo.file.type === "application/pdf",
    }));
    
    setModalFiles(files);
    setModalVisible(true);
  };

  const handleOpenUploadedPreview = async (documento: DocumentoConPreview) => {
    try {
      console.log("[handleOpenUploadedPreview] Abriendo:", documento.nombre);
      
      const url = documento.previewUrl || await obtenerUrlDocumento(documento.id_documento, 3600);
      
      const mimeInfo = getMimeTypeInfo(documento.mime_type);
      
      const files: FileObject[] = [{
        id: documento.id_documento.toString(),
        nombre_original: documento.nombre,
        url: url,
        file: undefined,
        esImagen: mimeInfo.esImagen,
        esPDF: mimeInfo.esPDF,
      }];
      
      setModalFiles(files);
      setModalVisible(true);
    } catch (error) {
      console.error("[handleOpenUploadedPreview] Error:", error);
      setErrorMessage("Error al abrir el documento. Intenta descargarlo.");
    }
  };

  const handleClosePreview = () => {
    setModalVisible(false);
    setModalFiles([]);
  };

  const renderThumbnail = (
    nombre: string,
    mimeType: string,
    onClick: (e: React.MouseEvent) => void,
    onRemove: (e: React.MouseEvent) => void,
    previewUrl?: string
  ) => {
    const mimeInfo = getMimeTypeInfo(mimeType);
    
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {mimeInfo.esImagen && previewUrl ? (
          <PreviewImage
            src={previewUrl}
            alt="Vista previa"
            style={{ 
              width: "100px", 
              height: "100px", 
              objectFit: "cover", 
              borderRadius: "5px", 
              cursor: "pointer",
              border: "1px solid #ddd"
            }}
            onClick={onClick}
          />
        ) : mimeInfo.esPDF ? (
          <div
            style={{
              width: "100px",
              height: "100px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "#fafafa",
            }}
            onClick={onClick}
          >
            <span style={{ fontSize: "24px" }}>📄</span>
          </div>
        ) : (
          <div
            style={{
              width: "100px",
              height: "100px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "#fafafa",
              padding: "5px",
            }}
            onClick={onClick}
          >
            <span style={{ fontSize: "24px" }}>📎</span>
            <span style={{ 
              fontSize: "10px", 
              textAlign: "center", 
              marginTop: "5px", 
              wordBreak: "break-all" 
            }}>
              {nombre.length > 15 ? nombre.substring(0, 12) + "..." : nombre}
            </span>
          </div>
        )}
        <button
          onClick={onRemove}
          style={{ 
            marginTop: "5px", 
            color: "#ff4d4f", 
            border: "none", 
            fontSize: "10px", 
            cursor: "pointer", 
            background: "none",
            textDecoration: "underline"
          }}
        >
          {previewUrl && mimeInfo.esImagen ? "Remover" : "Eliminar"}
        </button>
      </div>
    );
  };

  return (
    <>
      <ModalContainer ref={modalRef}>
        <Header>
          <span>Subir Documento - {tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
          <CloseButton onClick={onClose}>✖</CloseButton>
        </Header>

        {errorMessage && (
          <div style={{ 
            color: "#ff4d4f", 
            backgroundColor: "#fff2f0", 
            border: "1px solid #ffccc7",
            borderRadius: "4px",
            padding: "8px 12px",
            marginBottom: "10px",
            fontSize: "13px"
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <FormRow>
          {tipo !== "pago" && tipo !== "actividad" && (
            <FormGroup>
              <Label>Categoría</Label>
              {loading ? (
                <div style={{ fontSize: "13px", color: "#888" }}>Cargando categorías...</div>
              ) : (
                <Select
                  value={selectedCategoria}
                  disabled={
                    categoriasDocumentos.length === 0 ||
                    !!categoriaId ||
                    tiposConCategoriaDeshabilitada.includes(tipo)
                  }
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                >
                  {categoriasDocumentos.length > 0 ? (
                    categoriasDocumentos.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria.toString()}>
                        {cat.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="0">Sin Categoría</option>
                  )}
                </Select>
              )}
            </FormGroup>
          )}

          <FormGroup>
            <Label>Tipo</Label>
            <div
              style={{
                width: "100%",
                height: "40px",
                padding: "5px 10px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                color: "#888",
              }}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </div>
          </FormGroup>
        </FormRow>

        <DropZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              document.getElementById("fileInput")?.click();
            }
          }}
        >
          {archivos.length === 0 && archivosSubidos.length === 0 && (
            <div style={{ textAlign: "center", color: "#888" }}>
              Hacer clic o arrastrar los archivos en esta sección
            </div>
          )}

          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />

          {archivos.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ marginBottom: "10px", fontSize: "14px", color: "#333" }}>
                Archivos Pendientes ({archivos.length}):
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {archivos.map(({ file, localUrl, nombre_original }, index) => (
                  <div key={index}>
                    {renderThumbnail(
                      nombre_original,
                      file.type,
                      (e) => {
                        e.stopPropagation();
                        handleOpenPendingPreview();
                      },
                      (e) => {
                        e.stopPropagation();
                        handleRemover(index);
                      },
                      localUrl
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {archivosSubidos.length > 0 && (
            <div>
              <h4 style={{ marginBottom: "10px", fontSize: "14px", color: "#333" }}>
                Archivos Subidos ({archivosSubidos.length}):
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {archivosSubidos.map((doc) => (
                  <div key={doc.id_documento}>
                    {renderThumbnail(
                      doc.nombre,
                      doc.mime_type,
                      (e) => {
                        e.stopPropagation();
                        handleOpenUploadedPreview(doc);
                      },
                      (e) => handleEliminar(e, doc.id_documento),
                      doc.previewUrl
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DropZone>

        <Actions>
          <Button onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            primary 
            onClick={handleGuardar} 
            disabled={archivos.length === 0 || loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </Actions>
      </ModalContainer>

      {modalVisible && (
        <ModalVistaPrevia
          visible={modalVisible}
          files={modalFiles}
          onClose={handleClosePreview}
          onRemoveFile={handleRemover}
        />
      )}
    </>
  );
};

export default ModalDocumento;
