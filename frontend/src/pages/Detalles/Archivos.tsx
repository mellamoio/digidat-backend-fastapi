import React, { useState, useEffect } from "react";
import api from "../../api/api";
import type { ResponseError, ResponseSuccess } from "../../types/responses";
import type { Archivo } from "../../types/archivo";

interface ArchivosS3Props {
  codigoRegistro: number;
}

const ArchivosS3: React.FC<ArchivosS3Props> = ({ codigoRegistro }) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivos, setArchivos] = useState<Archivo[]>([]);

  const obtenerArchivos = async () => {
    try {
      const res = await api.get<ResponseSuccess<Archivo[]>>("/archivospago", {
        params: {
          codigo_registro: codigoRegistro
        },
      });
      if (res.data.status) {
        setArchivos(res.data.data);
      }
    } catch (error) {
      const err = error as ResponseError;
      console.error("Error al listar archivos:", err.response?.data?.message || "Error desconocido");
    }
  };

  const subirArchivo = async () => {
    if (!archivo) return alert("Selecciona un archivo primero.");

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("categoria", "1");
    formData.append("codigo_registro", codigoRegistro.toString());

    try {
      const res = await api.post<ResponseSuccess<any>>("/archivos3/subir", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.status) {
        setArchivo(null);
        await obtenerArchivos();
      }
    } catch (error) {
      const err = error as ResponseError;
      const errorMessage = err.response?.data?.message || "Error desconocido al subir el archivo";
      console.error("Error al subir archivo:", errorMessage);
      alert(`Error al subir archivo: ${errorMessage}`);
    }
  };

  const eliminarArchivo = async (id: number) => {
    try {
      const res = await api.post<ResponseSuccess<any>>(`/archivospago/${id}`, {
        data: {
          codigo_registro: codigoRegistro
        },
      });
      if (res.data.status) {
        await obtenerArchivos();
      }
    } catch (error) {
      const err = error as ResponseError;
      console.error("Error al eliminar archivo:", err.response?.data?.message || "Error desconocido");
    }
  };

  useEffect(() => {
    obtenerArchivos();
  }, [codigoRegistro]);

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)}
        className="mb-2 block"
      />
      <button
        onClick={subirArchivo}
        className="bg-blue-600 text-white px-2 py-1 rounded text-sm mr-2"
      >
        Subir
      </button>
      <ul className="space-y-1">
        {archivos.map((a) => (
          <li key={a.id} className="flex justify-between items-center">
            <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {a.nombre}
            </a>
            <button
              onClick={() => eliminarArchivo(a.id)}
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArchivosS3;