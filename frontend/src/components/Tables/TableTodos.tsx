import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableCustom } from '../DataTableCustom';
import type { TableColumn } from 'react-data-table-component';
import type { Obra } from '../../types/obra';
import type { EstadoEtapa } from '../../types/estado_etapa';
import { getEstadosEtapa } from '../../services/getEstadoEtapa.service';
import { useObras } from '../../context/ObrasContext';
import dayjs from 'dayjs';
import {
  ContainerLabel,
  EstadoField,
} from './TableTodos.styled';

export const TableTodos: React.FC = () => {
  const { obrasFiltradas, obras } = useObras();
  const [estadosEtapa, setEstadosEtapa] = useState<EstadoEtapa[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const rows = obrasFiltradas || obras || [];

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const estados = await getEstadosEtapa();
        setEstadosEtapa(estados);
      } catch (error) {
        console.error('Error al cargar estados:', error);
      }
    };
    fetchEstados();
  }, []);

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
    const estado = estadosEtapa.find((e) => e.id === estadoId);
    return {
      name: estado?.nombre ?? 'N/A',
      color: estado?.color ?? '#999999',
    };
  };

  const handleOnViewComponent = (row: Obra) => {
    navigate(`/obras/${row.id}`);
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
      selector: (row: Obra) => row.nombre,
    },
    {
      name: 'Responsable(s)',
      center: true,
      grow: 1.5,
      cell: (row: Obra) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {Array.isArray(row.usuarios) && row.usuarios.length > 0 ? (
            row.usuarios.map((usuario, index) => (
              <span key={index} style={{ fontSize: '13px' }}>
                {usuario.nombre || 'N/A'}
              </span>
            ))
          ) : (
            <span style={{ color: '#999' }}>Sin asignar</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Centro de Operación',
      center: true,
      grow: 1.5,
      cell: (row: Obra) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {Array.isArray(row.centros_operacion) && row.centros_operacion.length > 0 ? (
            row.centros_operacion.map((centro, index) => (
              <span key={index} style={{ fontSize: '13px' }}>
                {centro.nombre || 'N/A'}
              </span>
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
      selector: (row: Obra) => row.fecha_reembolso || '',
    },
    {
      name: 'Fecha de Culminación',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatDate(row.fecha_conclusion)}</span>,
      sortable: true,
      selector: (row: Obra) => row.fecha_conclusion || '',
    },
    {
      name: 'Estado',
      center: true,
      grow: 1.2,
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
      selector: (row: Obra) => row.estado_id,
    },
    {
      name: 'Costo del Proyecto',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatCurrency(row.costo_proyecto)}</span>,
      sortable: true,
      selector: (row: Obra) => row.costo_proyecto ?? 0,
    },
    {
      name: 'Monto Pagado',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatCurrency(row.monto_pagado)}</span>,
      sortable: true,
      selector: (row: Obra) => row.monto_pagado ?? 0,
    },
    {
      name: 'Monto Recuperado',
      center: true,
      grow: 1,
      cell: (row: Obra) => <span>{formatCurrency(row.monto_recuperado)}</span>,
      sortable: true,
      selector: (row: Obra) => row.monto_recuperado ?? 0,
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <DataTableCustom
        title=""
        columns={columns}
        data={rows}
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