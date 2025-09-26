import styled from "styled-components";
interface ButtonProps{
    active?: boolean
}
export const TabButtonStyled = styled.button<ButtonProps>`
    display: flex;
    border: 1px solid #D9D9D9;
    padding: 5px 8px;
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    line-height: 18px;
    transition: background-color 0.2s;
    background-color: ${props => props.active ? '#2E2EDA' : 'white'};
    color: ${props => props.active ? '#fff' : '#2D2B2B'};
    &:hover {
        ${props => !props.active && 'background-color: rgba(158, 158, 158, .2);;'}
        ${props => !props.active && 'color: #5C5C5C;'}
    }
`