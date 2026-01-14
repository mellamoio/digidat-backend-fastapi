import React, { useState, useRef, useEffect } from "react";
import apiClient from "../../../../api/api";
import type { ResponseError, ResponseSuccess } from "../../../../types/responses";
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
import ModalVistaPrevia from "./ModalVistaPrevia";
import { fetchCategoriasDocumento, type CategoriaDocumento } from "../../../../services/getCategoriasDocumentos.service";
import type { FileObject } from "../../../../types/pagos";
import type { Archivo } from "../../../../types/subirDocumento";

interface ModalDocumentoProps {
  categoria: string;
  tipo: string;
  actividadId?: number;
  requerimientoId?: number;
  carpetaBase: string;
  onClose: () => void;
  onDocumentsSaved?: (documentos: { file: File; url: string; id: number }[]) => void;
  codigoRegistro?: number;
  id_obra?: number | null;
  categoriaId?: number;
}

interface SubirArchivoResponse {
  archivo: {
    id: number;
    nombre_original: string;
    url: string;
    actividad_id: number;
    empresa_id: number;
    codigo_registro: number;
  };
}

const ModalDocumento: React.FC<ModalDocumentoProps> = ({
  categoria,
  tipo,
  actividadId,
  requerimientoId,
  carpetaBase,
  onClose,
  onDocumentsSaved,
  codigoRegistro,
  id_obra,
  categoriaId,
}) => {
  const [archivos, setArchivos] = useState<
    { file: File; localUrl: string; url?: string; id?: string; nombre_original: string }[]
  >([]);
  const [archivosSubidos, setArchivosSubidos] = useState<Archivo[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>(
    categoriaId ? categoriaId.toString() : categoria
  );
  const [categoriasDocumentos, setCategoriasDocumentos] = useState<CategoriaDocumento[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const empresaId = 1;
  const tipoMap: { [key: string]: number } = {
    documentos: 1,
    pago: 1,
    ND: 1,
    etapa: 1,
    contratista: 1,
    financista: 1,
  };

  const tiposConCategoriaDeshabilitada = ["pago", "etapa", "contratista", "financista"];

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const data = await fetchCategoriasDocumento();
        setCategoriasDocumentos(data);
        setSelectedCategoria(categoriaId ? categoriaId.toString() : categoria);
      } catch (error) {
        console.error("[fetchCategorias] Error al cargar categorías:", error);
        setCategoriasDocumentos([]);
        setSelectedCategoria(categoriaId ? categoriaId.toString() : categoria);
        setErrorMessage("Error al cargar las categorías de documentos.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();

    if (actividadId && codigoRegistro && carpetaBase) {
      obtenerArchivos();
    } else {
      console.warn("[obtenerArchivos] Faltan parámetros:", {
        actividadId,
        codigoRegistro,
        carpetaBase,
      });
    }

    return () => {
      archivos.forEach(({ localUrl }) => {
        if (localUrl) URL.revokeObjectURL(localUrl);
      });
    };
  }, [actividadId, codigoRegistro, carpetaBase, categoria, categoriaId]);

  const obtenerArchivos = async () => {
    try {
      if (!carpetaBase) {
        throw new Error("El campo carpeta_base es requerido.");
      }
      if (!codigoRegistro) {
        throw new Error("El campo codigo_registro es requerido.");
      }

      const params = {
        codigo_registro: codigoRegistro,
        empresa_id: empresaId,
        tipo: tipoMap[tipo] || 1,
        carpeta_base: carpetaBase,
        ...(actividadId && { actividad_id: actividadId }),
        ...(id_obra && { id_obra }),
        ...(tipo === "contratista" && categoriaId && { categoria_id: categoriaId }),
      };

      const res = await apiClient.get<ResponseSuccess<Archivo[]>>("/archivos/all", { params });

      if (res.data.status) {
        const mappedArchivos = res.data.data.map((doc) => ({
          ...doc,
          url: doc.url && !doc.url.startsWith("http")
            ? `${apiClient.defaults.baseURL}${doc.url.startsWith("/") ? "" : "/"}${doc.url}`
            : doc.url,
        }));
        setArchivosSubidos(mappedArchivos);
        if (mappedArchivos.length === 0) {
          console.warn("[obtenerArchivos] No se encontraron archivos para los parámetros:", params);
        }
      } else {
        setArchivosSubidos([]);
        console.warn("[obtenerArchivos] Respuesta sin status true:", res.data);
      }
    } catch (error) {
      const err = error as ResponseError;
      console.error("[obtenerArchivos] Error al listar archivos:", err.response?.data?.message || err.message);
      setArchivosSubidos([]);
      setErrorMessage("Error al obtener los archivos subidos.");
    }
  };

  const subirArchivo = async (files: File[]): Promise<{ url: string; id: number }[]> => {
    if (!files || files.length === 0) {
      throw new Error("Selecciona al menos un archivo.");
    }
    if (!carpetaBase) {
      throw new Error("El campo carpeta_base es requerido.");
    }
    if (!codigoRegistro || isNaN(codigoRegistro) || codigoRegistro <= 0) {
      throw new Error("El código de registro debe ser un número positivo válido.");
    }
    if (actividadId && (isNaN(actividadId) || actividadId <= 0)) {
      throw new Error("El ID de actividad debe ser un número positivo válido.");
    }

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      let effectiveCategoriaId: string;

      if (categoriaId) {
        effectiveCategoriaId = categoriaId.toString();
      } else if (tiposConCategoriaDeshabilitada.includes(tipo)) {
        effectiveCategoriaId = "0";
      } else {
        effectiveCategoriaId = selectedCategoria;
        if (!effectiveCategoriaId || isNaN(parseInt(effectiveCategoriaId))) {
          console.warn("[subirArchivo] Categoría no válida, usando 0:", effectiveCategoriaId);
          effectiveCategoriaId = "0";
        }
      }

      formData.append("categoria", effectiveCategoriaId);
      formData.append("archivo", file);
      formData.append("codigo_registro", codigoRegistro.toString());
      formData.append("empresa_id", empresaId.toString());
      const tipoId = tipoMap[tipo] || 1;
      formData.append("tipo", tipoId.toString());
      formData.append("carpeta_base", carpetaBase);
      if (actividadId) {
        formData.append("actividad_id", actividadId.toString());
      }
      if (id_obra) {
        formData.append("id_obra", id_obra.toString());
      }

      try {
        const res = await apiClient.post<SubirArchivoResponse>("/archivos/subir", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const url = res.data.archivo.url && !res.data.archivo.url.startsWith("http")
          ? `${apiClient.defaults.baseURL}${res.data.archivo.url.startsWith("/") ? "" : "/"}${res.data.archivo.url}`
          : res.data.archivo.url;
        return { url, id: res.data.archivo.id };
      } catch (error: any) {
        console.error("[subirArchivo] Error al subir archivo:", file.name, error);
        throw new Error(`Error al subir ${file.name}: ${error.response?.data?.message || error.message}`);
      }
    });
    return Promise.all(uploadPromises);
  };

  const eliminarArchivo = async (id: number) => {
    try {
      await apiClient.delete(`/archivosdelete/${id}`, {
        params: {
          codigo_registro: codigoRegistro || actividadId,
          empresa_id: empresaId,
          ...(id_obra && { id_obra }),
        },
      });
      setArchivosSubidos((prev) => prev.filter((archivo) => archivo.id !== id));
    } catch (error) {
      const err = error as ResponseError;
      console.error("[eliminarArchivo] Error al eliminar archivo:", err.response?.data?.message || err.message);
      setErrorMessage("Error al eliminar el archivo.");
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
      setErrorMessage("Por favor, selecciona al menos un archivo para subir.");
      return;
    }

    try {
      const filesToUpload = archivos.map((archivo) => archivo.file);
      const uploadedFiles = await subirArchivo(filesToUpload);

      const nuevosDocumentos = uploadedFiles.map((uploadedFile, index) => ({
        file: archivos[index].file,
        url: uploadedFile.url,
        id: uploadedFile.id,
      }));

      if (onDocumentsSaved) {
        onDocumentsSaved(nuevosDocumentos);
      }
      setArchivos([]);
      if (codigoRegistro || actividadId) {
        await obtenerArchivos();
      }
      setErrorMessage(null);
    } catch (error: any) {
      console.error("[handleGuardar] Error al guardar los documentos:", error);
      setErrorMessage(`Error al guardar los documentos: ${error.message}`);
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
      if (prevArchivos[index].localUrl) {
        URL.revokeObjectURL(prevArchivos[index].localUrl);
      }
      return updatedArchivos;
    });
  };

  const handleOpenPreview = (
    file: { file: File; localUrl: string; url?: string; nombre_original: string; id?: string } | Archivo
  ) => {
    setModalVisible(true);
  };

  const handleClosePreview = () => {
    setModalVisible(false);
  };

  const modalFiles: FileObject[] = [
    ...archivos.map((archivo, index) => ({
      id: archivo.id || `local-${index}`,
      nombre_original: archivo.nombre_original,
      url: archivo.url || archivo.localUrl,
      file: archivo.file,
      esImagen: archivo.file.type.startsWith("image/"),
      esPDF: archivo.file.type === "application/pdf",
    })),
    ...archivosSubidos.map((archivo) => ({
      id: archivo.id.toString(),
      nombre_original: archivo.nombre_original,
      url: archivo.url,
      file: undefined,
      esImagen: archivo.esImagen,
      esPDF: archivo.esPDF,
    })),
  ];

  return (
    <ModalContainer ref={modalRef}>
      <Header>
        <span>Subir Documento</span>
        <CloseButton onClick={onClose}>✖</CloseButton>
      </Header>

      {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}

      <FormRow>
        <FormGroup>
          <Label>Categoría</Label>
          {loading ? (
            <div>Cargando categorías...</div>
          ) : (
            <Select
              value={selectedCategoria}
              disabled={
                categoriasDocumentos.length === 0 ||
                !!categoriaId
              }
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategoria(e.target.value)}
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
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {archivos.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
            {archivos.map(({ file, localUrl, nombre_original }, index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {file.type.startsWith("image/") ? (
                  <PreviewImage
                    src={localUrl}
                    alt="Vista previa"
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px", cursor: "pointer" }}
                    onClick={() => handleOpenPreview({ file, localUrl, nombre_original })}
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
                    }}
                    onClick={() => handleOpenPreview({ file, localUrl, nombre_original })}
                  >
                    <span>PDF</span>
                  </div>
                ) : (
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
                    }}
                    onClick={() => handleOpenPreview({ file, localUrl, nombre_original })}
                  >
                    <span>{nombre_original || file.name}</span>
                  </div>
                )}
                <button
                  onClick={() => handleRemover(index)}
                  style={{ marginTop: "5px", color: "#2D2B2B", border: "none", fontSize: "10px", cursor: "pointer", background: "none" }}
                >
                  Remover archivo
                </button>
              </div>
            ))}
          </div>
        )}

        {(codigoRegistro || actividadId) && archivosSubidos.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h4>Archivos Subidos:</h4>
            <ul style={{ listStyle: "none", padding: "0" }}>
              {archivosSubidos.map((a) => (
                <li key={a.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span
                    style={{ color: "#722AE9", cursor: "pointer" }}
                    onClick={() => handleOpenPreview(a)}
                  >
                    {a.nombre_original}
                  </span>
                  <button
                    onClick={() => eliminarArchivo(a.id)}
                    style={{ color: "#ff4d4f", border: "none", background: "none", cursor: "pointer" }}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DropZone>

      <Actions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button primary onClick={handleGuardar} disabled={archivos.length === 0}>
          Guardar
        </Button>
      </Actions>

      {modalVisible && (
        <ModalVistaPrevia
          visible={modalVisible}
          files={modalFiles}
          onClose={handleClosePreview}
          onRemoveFile={handleRemover}
        />
      )}
    </ModalContainer>
  );
};

export default ModalDocumento;