import styled from 'styled-components'

interface ProgressBarProps {
    poder: number
}

export const ProgressBarLine = styled.div<ProgressBarProps>`
    background-color: #722AE9;
    width: ${(props) => props.poder}%;
`
