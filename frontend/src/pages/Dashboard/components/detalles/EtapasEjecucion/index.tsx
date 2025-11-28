import React, { useState } from "react";
import type { TableColumn } from "react-data-table-component";
import { DataTableCustom, type DataRow as TableDataRow } from "../../../../../components/DataTableCustom/index";

interface ExtendedDataRow extends TableDataRow {
  id: number;
  secuencia_id?: number;
  name: string;
  fecha: string;
  comentarios?: string;
  atencion_estado_id: number;
  tipo_estado_ejecucion_id: number;
  responsable: { nombre: string }[];
  id_obra_impuesto: number;
}

// Puedes omitir los props si no los usas en el cuerpo
export const EtapasEjecucion: React.FC = () => {
  // HARD DATA
  const mockActividades: ExtendedDataRow[] = [
    {
      id: 1,
      secuencia_id: 1,
      name: "Excavación",
      fecha: "20/11/2025",
      comentarios: "Listo para continuar",
      atencion_estado_id: 1,
      tipo_estado_ejecucion_id: 2,
      responsable: [{ nombre: "Juan Pérez" }],
      id_obra_impuesto: 101,
    },
    {
      id: 2,
      secuencia_id: 2,
      name: "Cimentación",
      fecha: "25/11/2025",
      comentarios: "",
      atencion_estado_id: 1,
      tipo_estado_ejecucion_id: 1,
      responsable: [{ nombre: "Maria Torres" }],
      id_obra_impuesto: 101,
    },
  ];

  const [actividades] = useState<ExtendedDataRow[]>(mockActividades);

  const ESTADOS_POSIBLES = [
    { id: 1, nombre: "Pendiente" },
    { id: 2, nombre: "En ejecución" },
    { id: 3, nombre: "Finalizado" },
  ];

  const columns: TableColumn<ExtendedDataRow>[] = [
    { name: "Sec.", selector: (row) => row.secuencia_id || 0, width: "60px" },
    { name: "Título", selector: (row) => row.name, minWidth: "200px", wrap: true },
    { name: "Fecha", selector: (row) => row.fecha, width: "120px", wrap: true },
    {
      name: "Estado",
      selector: (row) =>
        ESTADOS_POSIBLES.find((e) => e.id === row.tipo_estado_ejecucion_id)?.nombre ||
        "Desconocido",
      width: "150px",
    },
    { name: "Comentarios", selector: (row) => row.comentarios || "", minWidth: "200px", wrap: true },
  ];

  return (
    <div style={{ marginTop: "16px", position: "relative" }}>
      <DataTableCustom<ExtendedDataRow>
        columns={columns}
        data={actividades}
        emptyText="No hay actividades"
        title=""
        totalRows={actividades.length}
        currentPage={1}
        rowsPerPage={actividades.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </div>
  );
};

export default EtapasEjecucion;