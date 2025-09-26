import styled from 'styled-components'

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px;
`

export const ScrollWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    position: relative;
    max-width: 100%;
`

export const ScrollArea = styled.div`
    display: flex;
    overflow-x: auto;
    gap: 5px;
    flex-grow: 1;
    max-width: 100%;
    scroll-behavior: smooth;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
`

export const ArrowScroll = styled.button<{ direction: 'left' | 'right' }>`
    position: absolute;
    top: 0;
    bottom: 0;
    ${({ direction }) => (direction === 'right' ? 'right: 0;' : 'left: 0;')}
    height: 100%;
    width: 80px;
    background: ${({ direction }) =>
        direction === 'right'
            ? 'linear-gradient(90deg, transparent 10%, #F0F2F5 70%)'
            : 'linear-gradient(270deg, transparent 10%, #F0F2F5 70%)'};
    border: none;
    display: flex;
    align-items: center;
    justify-content: ${({ direction }) =>
        direction === 'right' ? 'flex-end' : 'flex-start'};
    padding: 0 8px;
    cursor: pointer;
    z-index: 10;
    i {
        color: #722AE9;
        font-size: 32px;
        color: #999;
    }

    &:hover i {
        color: #333;
    }
`

export const ProgressItemWrapper = styled.div<{}>`
    display: flex;
    align-items: center;

    @media (min-width: 992px) {
        flex: 1;
    }
`

export const ProgressItem = styled.div<{
    isSelected: boolean
    bgColor: string
    textColor: string
    selectedColor: string
    numberColor: string
    isFirst: boolean
    fullWidth?: boolean
}>`
    background-color: ${({ isSelected, bgColor, selectedColor }) =>
        isSelected ? selectedColor : bgColor};
    padding: 16px 24px;
    min-width: 194px;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 400;
    z-index: 2;

    color: ${({ isSelected, textColor }) =>
        isSelected ? '#ffffff' : textColor};

    .content {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    }

    .text-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .number {
        font-size: 18px;
        font-weight: 700;
        color: ${({ isSelected, numberColor }) =>
            isSelected ? '#ffffff' : numberColor};
    }

    .label {
        font-size: 14px;
        font-weight: 500;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

export const IconWrapper = styled.div`
    margin-right: 10px;
`
