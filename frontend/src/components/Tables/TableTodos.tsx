import React, { useEffect } from 'react';
import { DataTableCustom } from '../DataTableCustom';
import type { TableColumn } from 'react-data-table-component';
import {
  ContainerLabel,
  ContainerSelectTable,
  EstadoRow,
  EstadoField,
  StickyTableStyles,
} from './TableTodos.styled';
import { Row } from '../Row';
import type { Obra } from '../../types/obra';

// Datos estáticos de ejemplo
const obrasEjemplo: Obra[] = [
  {
    id: 1,
    nombre: 'Proyecto 1',
    estado_id: 1,
    monto_pagado: 50000,
    monto_recuperado: 25000,
    costo_proyecto: '150000',
    fecha_reembolso: '2023-01-15',
    fecha_conclusion: '2023-12-31',
    centros_operacion: [{ id: 1, nombre: 'Centro Principal' }],
    tipo_id: 0,
    responsable: [],
    unidades_gestion: [],
    id_empresa: 0,
  },
  {
    id: 2,
    nombre: 'Proyecto 2',
    estado_id: 2,
    monto_pagado: 75000,
    monto_recuperado: 50000,
    costo_proyecto: '200000',
    fecha_reembolso: '2023-02-20',
    fecha_conclusion: '2023-11-30',
    centros_operacion: [{ id: 2, nombre: 'Centro Secundario' }],
    tipo_id: 0,
    responsable: [],
    unidades_gestion: [],
    id_empresa: 0,
  },
];

export const TableTodos: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Obra[]>(obrasEjemplo);

  const formatCurrency = (value: number | string | undefined): string => {
    if (value === undefined || value === null || value === '') {
      return 'S/. 0.00';
    }
    const numericValue =
      typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
    if (isNaN(numericValue)) {
      return 'S/. 0.00';
    }
    return `S/. ${numericValue.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date: string | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-PE');
  };

  const handleOnViewComponent = (row: Obra) => {
    window.location.href = `/satelite/detalles/${row.id}`;
  };

  const columns: TableColumn<Obra>[] = [
    {
      name: 'Obra',
      center: true,
      minWidth: '150px',
      maxWidth: '200px',
      grow: 0,
      cell: (row: Obra) => (
        <Row>
          <ContainerLabel pointer="true">{row.nombre || 'Sin nombre'}</ContainerLabel>
        </Row>
      ),
    },
    {
      name: 'Centro de Operación',
      center: true,
      maxWidth: '200px',
      grow: 0,
      cell: (row: Obra) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {Array.isArray(row.centros_operacion) && row.centros_operacion.length > 0 ? (
            row.centros_operacion.map((centro, index) => (
              <span key={index}>{centro.nombre || 'N/A'}</span>
            ))
          ) : (
            <span>N/A</span>
          )}
        </div>
      ),
    },
    {
      name: 'Fecha de Inicio',
      maxWidth: '200px',
      center: true,
      grow: 0,
      cell: (row: Obra) => <span>{formatDate(row.fecha_reembolso)}</span>,
    },
    {
      name: 'Fecha de Culminación',
      maxWidth: '200px',
      center: true,
      grow: 0,
      cell: (row: Obra) => <span>{formatDate(row.fecha_conclusion)}</span>,
    },
    {
      name: 'Estado',
      maxWidth: '200px',
      center: true,
      grow: 0,
      cell: (row: Obra) => (
        <ContainerSelectTable>
          <EstadoRow>
            <EstadoField $backgroundColor="#722AE9">{row.estado_id || 'N/A'}</EstadoField>
          </EstadoRow>
        </ContainerSelectTable>
      ),
    },
    {
      name: 'Costo del Proyecto',
      maxWidth: '200px',
      center: true,
      grow: 0,
      cell: (row: Obra) => <span>{formatCurrency(row.costo_proyecto)}</span>,
    },
    {
      name: 'Monto Pagado',
      maxWidth: '200px',
      center: true,
      grow: 0,
      cell: (row: Obra) => <span>{formatCurrency(row.monto_pagado)}</span>,
    },
    {
      name: 'Monto Recuperado',
      maxWidth: '200px',
      center: true,
      grow: 0,
      cell: (row: Obra) => <span>{formatCurrency(row.monto_recuperado)}</span>,
    },
  ];

  return (
    <div className="row" style={{ position: 'relative' }}>
      <div
        className="col-md-12 md-max-type-b"
        style={{ backgroundColor: 'white', marginTop: 20 }}
      >
        <StickyTableStyles />
        <DataTableCustom
          title=""
          columns={columns}
          data={rows || []}
          totalRows={rows.length}
          currentPage={1}
          rowsPerPage={10}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          emptyText="No existen Obras registradas"
          stickyColumns
          onViewComponent={handleOnViewComponent}
        />
      </div>
    </div>
  );
};

export default TableTodos;