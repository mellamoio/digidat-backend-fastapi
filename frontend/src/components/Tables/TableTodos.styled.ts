import styled from "styled-components";

import { createGlobalStyle } from 'styled-components';

export const StickyTableStyles = createGlobalStyle`
  .sticky-table .rdt_TableHeadRow > div:first-child {
    position: sticky;
    left: 0;
    z-index: 400;
    border-right: 1px solid #DDDDDD;
  }

  .sticky-table .rdt_TableHeadRow > div:last-child {
    position: sticky;
    right: 0;
    z-index: 400;
    border-left: 1px solid #DDDDDD;
  }
`;

export const ContainerSelectTable = styled.div`
  min-width: 180px;
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
  min-width: 190px;
`;

export const ContainerFiltrosHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 24px;
`;

export const ContainerFiltroSelect = styled.div`
  min-width: 220px;
`;

interface ContainerLabelProps {
  pointer?: boolean | string;
}

export const ContainerLabel = styled.div<ContainerLabelProps>`
  cursor: ${({ pointer }) => (pointer === true || pointer === "true" ? "pointer" : "default")};
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

  svg {
    stroke: #ffffff;
  }
`;

