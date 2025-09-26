import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    background-color: #fff;
    padding: 4px 16px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ButtonScroll = styled.button`
    font-size: 48px;
    & > i {
        color: #722AE9;
    }
`;

export const ContainerScroll = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    background-color: #fff;
    padding: 0 16px;
    overflow-x: scroll;
    height: 195px;
    scrollbar-width: none; /* Para Firefox */
    -ms-overflow-style: none; /* Para Internet Explorer y Edge */
    
    &::-webkit-scrollbar {
        display: none; /* Para Chrome, Safari y Opera */
    }
`;
