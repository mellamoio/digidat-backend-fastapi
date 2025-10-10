import styled from "styled-components";
interface Props {
    color?: string,
    backgroundColor?: string
    width?: string
    height?: string
}
export const ContainerIcon = styled.span<Props>`
    width: ${props => props.width || '24px'};
    height: ${props => props.height || '24px'};
    background-color: ${props => props.backgroundColor || '#333'};
    color: ${props => props.color || '#fff'};
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
`