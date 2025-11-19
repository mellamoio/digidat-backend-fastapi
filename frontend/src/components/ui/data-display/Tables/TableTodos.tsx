import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { DataTableCustom } from '../DataTableCustom';
import type { TableColumn } from 'react-data-table-component';
import { getObra } from '../../../../services/getObra.service';
import { getEstadosEtapa } from '../../../../services/getEstadoEtapa.service';
import type { ObraResponse } from '../../../../types/obra';
import type { EstadoEtapa } from '../../../../types/estado_etapa';
import dayjs from 'dayjs';
import {
  ContainerLabel,
  EstadoField,
} from './TableTodos.styled';

export const TableTodos: React.FC = () => {
  const [rows, setRows] = useState<ObraResponse[]>([]);
  const [estadosEtapa, setEstadosEtapa] = useState<EstadoEtapa[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Cargar obras y estados al montar el componente
  useEffect(() => {
    console.log('TableTodos montado - Cargando datos iniciales');
    loadData();
    
    // Escuchar evento de obra creada desde el Header
    const handleObraCreated = () => {
      console.log('Evento obraCreated recibido - Recargando datos');
      loadData();
    };

    window.addEventListener('obraCreated', handleObraCreated);

    return () => {
      console.log('TableTodos desmontado - Limpiando event listener');
      window.removeEventListener('obraCreated', handleObraCreated);
    };
  }, []);

  const loadData = async () => {
    try {
      console.log('Iniciando carga de datos...');
      setLoading(true);
      
      // Cargar obras y estados en paralelo
      const [obras, estados] = await Promise.all([
        getObra({ id_empresa: 1 }),
        getEstadosEtapa()
      ]);
      
      console.log('Obras cargadas:', obras);
      console.log('Estados cargados:', estados);
      
      setRows(obras);
      setEstadosEtapa(estados);
    } catch (error: any) {
      console.error('Error al cargar datos:', error);
      message.error('Error al cargar los datos');
      setRows([]);
      setEstadosEtapa([]);
    } finally {
      setLoading(false);
      console.log('Carga de datos finalizada');
    }
  };

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

  const formatDate = (date: string | null | undefined): string => {
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

  const handleOnViewComponent = (row: ObraResponse) => {
    navigate(`/obras/${row.id_obra}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const columns: TableColumn<ObraResponse>[] = [
    {
      name: 'Obra',
      center: true,
      grow: 1.5,
      cell: (row: ObraResponse) => (
        <ContainerLabel pointer="true">
          {row.nombre || 'Sin nombre'}
        </ContainerLabel>
      ),
      sortable: true,
      selector: (row: ObraResponse) => row.nombre,
    },
    {
      name: 'Centro de Operación',
      center: true,
      grow: 1.5,
      cell: (row: ObraResponse) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {Array.isArray(row.centros_operacion) && row.centros_operacion.length > 0 ? (
            row.centros_operacion.map((centro, index) => (
              <span key={centro.id} style={{ fontSize: '13px' }}>
                {centro.nombre}
                {index < row.centros_operacion.length - 1 && ','}
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
      name: 'Responsable',
      center: true,
      grow: 1,
      cell: (row: ObraResponse) => (
        <span>{row.responsable?.nombre || 'N/A'}</span>
      ),
      sortable: true,
      selector: (row: ObraResponse) => row.responsable?.nombre || '',
    },
    {
      name: 'Fecha de Inicio',
      center: true,
      grow: 1,
      cell: (row: ObraResponse) => <span>{formatDate(row.fecha_inicio)}</span>,
      sortable: true,
      selector: (row: ObraResponse) => row.fecha_inicio || '',
    },
    {
      name: 'Fecha de Conclusión',
      center: true,
      grow: 1,
      cell: (row: ObraResponse) => <span>{formatDate(row.fecha_fin)}</span>,
      sortable: true,
      selector: (row: ObraResponse) => row.fecha_fin || '',
    },
    {
      name: 'Estado',
      center: true,
      grow: 1.2,
      cell: (row: ObraResponse) => {
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
      selector: (row: ObraResponse) => row.estado_id,
    },
    {
      name: 'Costo del Proyecto',
      center: true,
      grow: 1,
      cell: (row: ObraResponse) => <span>{formatCurrency(row.costo_proyecto)}</span>,
      sortable: true,
      selector: (row: ObraResponse) => row.costo_proyecto,
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