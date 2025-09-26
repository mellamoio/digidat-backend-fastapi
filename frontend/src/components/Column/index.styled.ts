import styled from "styled-components";

interface ColumnProps {
    flex?: number;
    minWidth?: string;
    opacity?: number;
    gap?:number;
    maxHeight?: string;
    height?: string;
    scroll?: boolean;
    padding?: string;
    gridArea?: string;
}

export const ColumnStyled = styled.div<ColumnProps>`
    display: flex;
    flex-direction: column;
    gap: ${props => props.gap || '16'}px;
    ${props => props.flex && `flex: ${props.flex};`}
    ${props => props.minWidth && `min-width: ${props.minWidth};`}
    ${props => props.opacity!==undefined ? `opacity: ${props.opacity};`:''}
    ${props => props.maxHeight && `max-height: ${props.maxHeight};`}
    ${props => props.scroll && `overflow-y: auto;`}
    ${props => props.height && `height: ${props.height};`}
    ${props => props.padding && `padding: ${props.padding};`}
    ${props => props.gridArea && `gridArea: ${props.gridArea};`}
    
`