import React, { useRef, useState, useEffect } from 'react'
import {
    ArrowScroll,
    IconWrapper,
    ProgressItem,
    ProgressItemWrapper,
    ScrollArea,
    ScrollWrapper,
    Wrapper
} from './index.styled'

interface EstadoItem {
    id: string | number
    label: string
    number: string | number
    icon?: React.ReactNode
    bgColor: string
    textColor: string
    selectedColor: string
    numberColor: string
}

interface ScrollableProgressProps<T extends EstadoItem> {
    estados: T[]
    selectedId?: T['id']
    setSelectedId: (id: T['id']) => void
}

const StatusBar = <T extends EstadoItem>({
    estados,
    selectedId,
    setSelectedId
}: ScrollableProgressProps<T>) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const checkScroll = () => {
        const el = scrollRef.current
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0)
            setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
        }
    }

    const scrollBy = (offset: number) => {
        scrollRef.current?.scrollBy({ left: offset, behavior: 'smooth' })
    }

    useEffect(() => {
        checkScroll()
        const el = scrollRef.current
        if (!el) return

        el.addEventListener('scroll', checkScroll)
        window.addEventListener('resize', checkScroll)

        return () => {
            el.removeEventListener('scroll', checkScroll)
            window.removeEventListener('resize', checkScroll)
        }
    }, [])

    return (
        <Wrapper>
            {estados.length > 0 && (
                <ProgressItem
                    isSelected={estados[0].id === selectedId}
                    bgColor={estados[0].bgColor}
                    textColor={estados[0].textColor}
                    selectedColor={estados[0].selectedColor}
                    numberColor={estados[0].numberColor}
                    isFirst={true}
                    onClick={() => setSelectedId(estados[0].id)}
                >
                    <div className="content">
                        {estados[0].icon && (
                            <IconWrapper>{estados[0].icon}</IconWrapper>
                        )}
                        <div className="text-content">
                            <span className="number">{estados[0].number}</span>
                            <span className="label" style={{ color: '#fff' }}>
                                {estados[0].label}
                            </span>
                        </div>
                    </div>
                </ProgressItem>
            )}

            <ScrollWrapper>
                {canScrollLeft && (
                    <ArrowScroll
                        direction="left"
                        onClick={() => scrollBy(-300)}
                    >
                        <i className="mdi mdi-chevron-left" />
                    </ArrowScroll>
                )}
                <ScrollArea ref={scrollRef}>
                    {estados.slice(1).map((estado) => (
                        <ProgressItemWrapper key={estado.id}>
                            <ProgressItem
                                isSelected={estado.id === selectedId}
                                bgColor={estado.bgColor}
                                textColor={estado.textColor}
                                selectedColor={estado.selectedColor}
                                numberColor={estado.numberColor}
                                isFirst={false}
                                fullWidth={true}
                                onClick={() => setSelectedId(estado.id)}
                            >
                                <div className="content">
                                    {estado.icon && (
                                        <IconWrapper>{estado.icon}</IconWrapper>
                                    )}
                                    <div className="text-content">
                                        <span className="number">
                                            {estado.number}
                                        </span>
                                        <span
                                            className="label"
                                            style={{
                                                color:
                                                    estado.id === selectedId
                                                        ? '#fff'
                                                        : '#000'
                                            }}
                                        >
                                            {estado.label}
                                        </span>
                                    </div>
                                </div>
                            </ProgressItem>
                        </ProgressItemWrapper>
                    ))}
                </ScrollArea>
                {canScrollRight && (
                    <ArrowScroll
                        direction="right"
                        onClick={() => scrollBy(300)}
                    >
                        <i className="mdi mdi-chevron-right" />
                    </ArrowScroll>
                )}
            </ScrollWrapper>
        </Wrapper>
    )
}

export default StatusBar
