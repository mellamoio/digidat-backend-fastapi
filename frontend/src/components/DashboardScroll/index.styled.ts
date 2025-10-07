import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 4px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const ButtonScroll = styled.button`
    font-size: 48px;
    & > i {
        color: #722AE9;
    }
`;

export const ContainerScroll = styled.div`
    display: flex;
    align-items: center;
    background-color: #fff;
    overflow-x: scroll;
    height: 195px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
        display: none;
    }
`;
