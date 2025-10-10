import styled from 'styled-components'

// En ItemQuantity/index.styled.ts
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px 16px;
    text-align: center;
    width: 100%;

    h5 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 22px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #333;
        width: 100%;
    }
`;