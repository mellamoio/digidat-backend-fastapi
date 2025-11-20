import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableCustom } from '../DataTableCustom';
import type { TableColumn } from 'react-data-table-component';
import {
  ContainerLabel,
  EstadoField,
} from './TableTodos.styled';
import type { Obra } from '../../types/obra';
import dayjs from 'dayjs';

interface EstadoAtencion {
  id: number;
  name: string;
  color?: string;
}

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

// Estados de atención estáticos
const estadosAtencionEjemplo: EstadoAtencion[] = [
  { id: 1, name: 'En Progreso', color: '#722AE9' },
  { id: 2, name: 'Completado', color: '#28A745' },
];

export const TableTodos: React.FC = () => {
  const [rows] = React.useState<Obra[]>(obrasEjemplo);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();

  const formatCurrency = (value: number | string | undefined): string => {
    if (value === undefined || value === null || value === '') {
      return 'S/. 0.00';
    }
    const numericValue =
      typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
    if (isNaN(numericValue)) {
      return 'S/. 0.00';
    }
    const fixedValue = numericValue.toFixed(2);
    const [integerPart, decimalPart] = fixedValue.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `S/. ${formattedInteger}.${decimalPart}`;
  };

  const formatDate = (date: string | undefined): string => {
    if (!date) return 'N/A';
    return dayjs(date).format('DD/MM/YYYY');
  };

  const getEstadoInfo = (estadoId?: number) => {
    const estado = estadosAtencionEjemplo.find((e) => e.id === estadoId);
    return {
      name: estado?.name ?? 'N/A',
      color: estado?.color ?? '#000000',
    };
  };

  const handleOnViewComponent = (row: Obra) => {
    navigate(`/detalles/${row.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const columns: TableColumn<Obra>[] = [
    {
      name: 'Obra',
      center: true,
      grow: 1.5,
      cell: (row: Obra) => (
        <ContainerLabel pointer="true">
          {row.nombre || 'Sin nombre'}
        </ContainerLabel>
      ),
      sortable: true,
    },
    {
      name: 'Centro de Operación',
      center: true,
      grow: 1.5,
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
      sortable: true,
    },
    {
      name: 'Fecha de Inicio',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatDate(row.fecha_reembolso)}</span>,
      sortable: true,
    },
    {
      name: 'Fecha de Culminación',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatDate(row.fecha_conclusion)}</span>,
      sortable: true,
    },
    {
      name: 'Estado',
      center: true,
      grow: 1,
      cell: (row: Obra) => {
        const { name, color } = getEstadoInfo(row.estado_id);
        return (
          <EstadoField $backgroundColor={color}>
            {name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </EstadoField>
        );
      },
      sortable: true,
    },
    {
      name: 'Costo del Proyecto',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatCurrency(row.costo_proyecto)}</span>,
      sortable: true,
    },
    {
      name: 'Monto Pagado',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatCurrency(row.monto_pagado)}</span>,
      sortable: true,
    },
    {
      name: 'Monto Recuperado',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatCurrency(row.monto_recuperado)}</span>,
      sortable: true,
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <DataTableCustom
        title=""
        columns={columns}
        data={rows || []}
        totalRows={rows.length}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        emptyText="No existen Obras registradas"
        stickyColumns={true}
        onViewComponent={handleOnViewComponent}
      />
    </div>
  );
};

export default TableTodos;