import styled from "styled-components";
import { TabButtonStyled } from "../TabButton/index.styled";


export const GroupTabButtonsStyled = styled.div`
    display: flex;
    width: fit-content;
    ${TabButtonStyled}:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    ${TabButtonStyled}:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    
`