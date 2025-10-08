import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [rows, setRows] = React.useState<Obra[]>(obrasEjemplo);
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

  const getCostoProyecto = (obra: Obra) => {
    return formatCurrency(obra.costo_proyecto || 0);
  };

  const getMontoPagado = (obra: Obra) => {
    return formatCurrency(obra.monto_pagado || 0);
  };

  const getMontoRecuperado = (obra: Obra) => {
    return formatCurrency(obra.monto_recuperado || 0);
  };

  const handleOnViewComponent = (row: Obra) => {
    navigate(`/detalles/${row.id}`);
  };

  const columns: TableColumn<Obra>[] = [
    {
      name: 'Obra',
      center: true,
      grow: 1,
      cell: (row: Obra) => (
        <Row>
          <ContainerLabel pointer="true">{row.nombre || 'Sin nombre'}</ContainerLabel>
        </Row>
      ),
    },
    {
      name: 'Centro de Operación',
      center: true,
      grow: 1,
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
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatDate(row.fecha_reembolso)}</span>,
    },
    {
      name: 'Fecha de Culminación',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatDate(row.fecha_conclusion)}</span>,
    },
    {
      name: 'Estado',
      center: true,
      grow: 1,
      cell: (row: Obra) => {
        const { name, color } = getEstadoInfo(row.estado_id);
        return (
          <ContainerSelectTable>
            <EstadoRow>
              <EstadoField $backgroundColor={color}>
                {name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            </EstadoRow>
          </ContainerSelectTable>
        );
      },
    },
    {
      name: 'Costo del Proyecto',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{getCostoProyecto(row)}</span>,
    },
    {
      name: 'Monto Pagado',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{getMontoPagado(row)}</span>,
    },
    {
      name: 'Monto Recuperado',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{getMontoRecuperado(row)}</span>,
    },
  ];

  return (
    <div className="row" style={{ position: 'relative', width: '100%' }}>
      <div
        className="col-md-12 md-max-type-b"
        style={{ backgroundColor: 'white', marginTop: 20, width: '100%' }}
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