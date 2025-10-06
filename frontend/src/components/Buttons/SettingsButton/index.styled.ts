import styled from "styled-components";

export const AnchorButton = styled.a`
    border-radius: 4px;
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #722AE9;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    
    &:hover {
        color: #fff;
    }
    
    &:active {
        transform: scale(0.98);
        opacity: 0.9;
    }
    
    &:focus {
        outline: none;
    }
`