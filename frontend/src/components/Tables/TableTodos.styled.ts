import styled from 'styled-components';

interface ContainerLabelProps {
  pointer?: boolean | string;
}

export const ContainerLabel = styled.div<ContainerLabelProps>`
  cursor: ${({ pointer }) => (pointer === true || pointer === 'true' ? 'pointer' : 'default')};
  width: 100%;
  text-align: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ pointer }) => (pointer === true || pointer === 'true' ? '#722AE9' : 'inherit')};
  }

  @media (max-width: 768px) {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface EstadoFieldProps {
  $backgroundColor: string;
}

export const EstadoField = styled.span<EstadoFieldProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 4px 8px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }

  svg {
    stroke: #ffffff;
    flex-shrink: 0;
  }
`;