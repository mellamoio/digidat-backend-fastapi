import styled, { createGlobalStyle } from 'styled-components';

export const StickyTableStyles = createGlobalStyle`
  .sticky-table .rdt_Table {
    border: 1px solid #DDDDDD;
    width: 100%;
    max-width: 100%;
    min-width: 300px;
    position: relative;
    display: flex;
    flex-direction: column; /* Asegurar que el contenedor maneje filas */

    @media (max-width: 1200px) {
      min-width: 250px;
    }

    @media (max-width: 768px) {
      min-width: 200px;
    }

    @media (max-width: 576px) {
      min-width: 150px;
    }
  }

  .sticky-table .rdt_TableHeadRow {
    display: flex;
    width: 100%;
    min-width: 0; /* Permitir que los hijos se ajusten */
  }

  .sticky-table .rdt_TableBody {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0; /* Permitir que los hijos se ajusten */
    overflow: auto; /* Habilitar scroll vertical si es necesario */
  }

  .sticky-table .rdt_TableBody .rdt_TableRow {
    display: flex;
    width: 100%;
    min-width: 0; /* Permitir que los hijos se ajusten */
  }

  /* Encabezado - Columna "Obra" */
  .sticky-table .rdt_TableHeadRow > div:first-child {
    position: sticky;
    left: 0;
    z-index: 400;
    background-color: #F1F1F1;
    border-right: 1px solid #DDDDDD;
    width: 100%; /* Forzar que ocupe el ancho disponible */
    min-width: 100px; /* Base mínima */
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center; /* Centrar contenido horizontalmente */

    @media (max-width: 768px) {
      min-width: 80px;
    }
  }

  /* Encabezado - Columna "Opciones" */
  .sticky-table .rdt_TableHeadRow > div:last-child {
    position: sticky;
    right: 0;
    z-index: 400;
    background-color: #F1F1F1;
    border-left: 1px solid #DDDDDD;
    width: 100%; /* Forzar que ocupe el ancho disponible */
    min-width: 100px; /* Base mínima */
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center; /* Centrar contenido horizontalmente */

    @media (max-width: 768px) {
      min-width: 80px;
    }
  }

  /* Cuerpo - Columna "Obra" */
  .sticky-table .rdt_TableBody .rdt_TableRow > div:first-child {
    position: sticky;
    left: 0;
    z-index: 300;
    background-color: #fff;
    border-right: 1px solid #DDDDDD;
    width: 100%; /* Forzar que ocupe el ancho disponible */
    min-width: 100px; /* Base mínima */
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center; /* Centrar contenido horizontalmente */

    @media (max-width: 768px) {
      min-width: 80px;
    }
  }

  /* Cuerpo - Columna "Opciones" */
  .sticky-table .rdt_TableBody .rdt_TableRow > div:last-child {
    position: sticky;
    right: 0;
    z-index: 300;
    background-color: #fff;
    border-left: 1px solid #DDDDDD;
    width: 100%; /* Forzar que ocupe el ancho disponible */
    min-width: 100px; /* Base mínima */
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center; /* Centrar contenido horizontalmente */

    @media (max-width: 768px) {
      min-width: 80px;
    }
  }

  /* Ocultar columnas menos importantes en pantallas pequeñas */
  @media (max-width: 992px) {
    .sticky-table .rdt_TableHeadRow > div:nth-child(n+4),
    .sticky-table .rdt_TableBody .rdt_TableRow > div:nth-child(n+4) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .sticky-table .rdt_TableHeadRow > div:nth-child(n+3),
    .sticky-table .rdt_TableBody .rdt_TableRow > div:nth-child(n+3) {
      display: none;
    }
  }
`;

export const ContainerSelectTable = styled.div`
  width: 100%;
  min-width: 100px;

  @media (max-width: 768px) {
    min-width: 80px;
  }
`;

export const ContainerCellTable = styled.div`
  display: flex;
  gap: 10px;
`;

interface CircleColorProps {
  color: string;
}

export const CircleColor = styled.div<CircleColorProps>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

export const ContainerProgress = styled.div`
  width: 100%;
  min-width: 100px;

  @media (max-width: 768px) {
    min-width: 80px;
  }
`;

export const ContainerFiltrosHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 24px;
`;

export const ContainerFiltroSelect = styled.div`
  min-width: 220px;

  @media (max-width: 768px) {
    min-width: 150px;
  }
`;

interface ContainerLabelProps {
  pointer?: boolean | string;
}

export const ContainerLabel = styled.div<ContainerLabelProps>`
  cursor: ${({ pointer }) => (pointer === true || pointer === 'true' ? 'pointer' : 'default')};
  width: 100%;

  @media (max-width: 768px) {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const EstadoRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

interface EstadoFieldProps {
  $backgroundColor: string;
}

export const EstadoField = styled.span<EstadoFieldProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 8px;
    svg {
      width: 16px;
      height: 16px;
    }
  }

  svg {
    stroke: #ffffff;
  }
`;