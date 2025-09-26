import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
    padding: 4px 16px;

    h5 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
