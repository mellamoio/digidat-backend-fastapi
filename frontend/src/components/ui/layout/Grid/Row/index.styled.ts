import styled from "styled-components";

interface RowProps {
    flex?: number;
    minWidth?: string;
    reverse?: boolean;
    pointer?: boolean;
    justify?:string;
    hide?: boolean;
}

export const RowStyled = styled.div<RowProps>`
    display:${props => props.hide ? 'none' : 'flex'};
    flex-direction: row;
    gap: 16px;
    ${props => props.flex && `flex: ${props.flex};`}
    ${props => props.minWidth && `min-width: ${props.minWidth};`}
    ${props => props.pointer && `cursor: pointer;`}
    flex-direction: ${props => props.reverse ? `row-reverse`:'row'};
    justify-content: ${props => props.justify || 'flex-start'};
    `