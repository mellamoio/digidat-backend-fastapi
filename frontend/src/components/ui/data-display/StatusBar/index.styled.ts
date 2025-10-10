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
    gap: 10px;
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
        font-size: 32px;
        color: #999;
    }

    &:hover i {
        color: #333;
    }
`

export const ProgressItemWrapper = styled.div`
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
    padding: 24px;
    min-width: ${({ isFirst }) => (isFirst ? '260px' : '210px')};
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    height: 120px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 400;
    z-index: 2;

    color: ${({ isSelected, textColor }) =>
        isSelected ? '#ffffff' : textColor};

    .content {
        display: flex;
        flex-direction: ${({ isFirst }) => (isFirst ? 'row' : 'column')};
        align-items: ${({ isFirst }) => (isFirst ? 'center' : 'flex-start')};
        justify-content: ${({ isFirst }) => (isFirst ? 'flex-start' : 'center')};
        gap: ${({ isFirst }) => (isFirst ? '16px' : '6px')};
        width: 100%;
        height: 100%;
    }

    .text-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .number {
        font-size: 32px;
        font-weight: 800;
        line-height: 1.2;
        color: ${({ isSelected, numberColor }) =>
            isSelected ? '#ffffff' : numberColor};
    }

    .label {
        font-size: 20px;
        font-weight: 600;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

export const IconWrapper = styled.div`
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
`