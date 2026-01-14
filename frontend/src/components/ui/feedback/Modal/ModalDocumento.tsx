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
import type { ModalDocumentoProps, DocumentoResponse } from "../../../../types/documentos";
import {
  buildUploadParams,
  buildGetDocumentosParams,
  getMimeTypeInfo,
} from "../../../../types/documentos.d";
import {
  obtenerDocumentos,
  subirDocumento,
  eliminarDocumento,
  obtenerUrlDocumento,
} from "../../../../services/getDocumentos.service";
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
  const [archivosSubidos, setArchivosSubidos] = useState<DocumentoResponse[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>(
    categoriaId ? categoriaId.toString() : categoria
  );
  const [categoriasDocumentos, setCategoriasDocumentos] = useState<CategoriaDocumento[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Estados para vista previa
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFiles, setModalFiles] = useState<FileObject[]>([]);
  
  const modalRef = useRef<HTMLDivElement>(null);

  const tiposConCategoriaDeshabilitada = ["pago", "etapa", "contratista", "financista"];

  useEffect(() => {
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

    // ✅ Solo cargar archivos si tenemos al menos un parámetro válido
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
  }, [id_obra, id_etapa, id_informacionfinancista, id_informacioncontratista, id_pago]);

  const cargarArchivos = async () => {
    try {
      const params = buildGetDocumentosParams({
        id_obra,
        id_etapa,
        id_informacionfinancista,
        id_informacioncontratista,
        id_pago,
      });

      console.log("[cargarArchivos] Parámetros:", params);

      const documentos = await obtenerDocumentos(params);
      setArchivosSubidos(documentos);
      console.log("[cargarArchivos] Documentos cargados:", documentos.length);
    } catch (error: any) {
      const err = error as ResponseError;
      console.error("[cargarArchivos] Error:", {
        status: err.response?.status,
        message: err.response?.data?.detail || err.message,
      });
      setArchivosSubidos([]);
      
      // Solo mostrar error si NO es 404 (puede no haber documentos aún)
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
        id: `local-${Math.random().toString(36).substr(2, 9)}`,
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

      // ✅ Subir todos los archivos en paralelo
      const uploadPromises = archivos.map((archivo) => 
        subirDocumento(archivo.file, params)
      );

      const uploadedDocs = await Promise.all(uploadPromises);

      console.log("[handleGuardar] Archivos subidos:", uploadedDocs.length);

      // Notificar al componente padre si existe el callback
      if (onDocumentsSaved) {
        const nuevosDocumentos = uploadedDocs.map((doc, index) => ({
          file: archivos[index].file,
          url: doc.ruta,
          id: doc.id_documento,
        }));
        onDocumentsSaved(nuevosDocumentos);
      }

      // Limpiar archivos locales
      archivos.forEach(({ localUrl }) => {
        if (localUrl) URL.revokeObjectURL(localUrl);
      });
      setArchivos([]);

      // Recargar lista de archivos subidos
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

  const handleEliminar = async (id: number) => {
    try {
      await eliminarDocumento(id);
      setArchivosSubidos((prev) => prev.filter((doc) => doc.id_documento !== id));
      console.log("[handleEliminar] Documento eliminado:", id);
    } catch (error) {
      console.error("[handleEliminar] Error:", error);
      setErrorMessage("Error al eliminar el archivo.");
    }
  };

  // ✅ Abrir vista previa - Archivos PENDIENTES
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

  // ✅ Abrir vista previa - Archivo SUBIDO (con URL firmada de S3)
  const handleOpenUploadedPreview = async (documento: DocumentoResponse) => {
    try {
      console.log("[handleOpenUploadedPreview] Obteniendo URL para:", documento.nombre);
      
      const url = await obtenerUrlDocumento(documento.id_documento, 3600);
      
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

  // ✅ Cerrar vista previa
  const handleClosePreview = () => {
    setModalVisible(false);
    setModalFiles([]);
  };

  return (
    <>
      <ModalContainer ref={modalRef}>
        <Header>
          <span>Subir Documento</span>
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
            {errorMessage}
          </div>
        )}

        <FormRow>
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
              }}
            >
              {tipo}
            </div>
          </FormGroup>
        </FormRow>

        <DropZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
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

          {/* Vista previa archivos pendientes */}
          {archivos.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
              {archivos.map(({ file, localUrl, nombre_original }, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {file.type.startsWith("image/") ? (
                    <PreviewImage
                      src={localUrl}
                      alt="Vista previa"
                      style={{ 
                        width: "100px", 
                        height: "100px", 
                        objectFit: "cover", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        border: "1px solid #ddd"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPendingPreview();
                      }}
                    />
                  ) : file.type === "application/pdf" ? (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPendingPreview();
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPendingPreview();
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>📎</span>
                      <span style={{ fontSize: "10px", textAlign: "center", marginTop: "5px", wordBreak: "break-all" }}>
                        {nombre_original.length > 15 ? nombre_original.substring(0, 12) + "..." : nombre_original}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemover(index);
                    }}
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
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Lista archivos subidos */}
          {archivosSubidos.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "10px", fontSize: "14px", color: "#333" }}>
                Archivos Subidos ({archivosSubidos.length}):
              </h4>
              <ul style={{ listStyle: "none", padding: "0" }}>
                {archivosSubidos.map((a) => {
                  const mimeInfo = getMimeTypeInfo(a.mime_type);
                  return (
                    <li 
                      key={a.id_documento} 
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        marginBottom: "10px",
                        padding: "8px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "4px",
                        border: "1px solid #e8e8e8"
                      }}
                    >
                      <span
                        style={{ 
                          color: "#2E2EDA", 
                          cursor: "pointer",
                          flex: 1,
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                        onClick={() => handleOpenUploadedPreview(a)}
                      >
                        <span>{mimeInfo.esImagen ? "🖼️" : mimeInfo.esPDF ? "📄" : "📎"}</span>
                        {a.nombre}
                      </span>
                      <button
                        onClick={() => handleEliminar(a.id_documento)}
                        style={{ 
                          color: "#ff4d4f", 
                          border: "none", 
                          background: "none", 
                          cursor: "pointer",
                          fontSize: "12px",
                          textDecoration: "underline"
                        }}
                      >
                        Eliminar
                      </button>
                    </li>
                  );
                })}
              </ul>
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

      {/* Modal Vista Previa */}
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