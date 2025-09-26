import React, { useRef, useState } from 'react'
import {
    ButtonScroll,
    Container,
    ContainerScroll
} from './index.styled'
interface Props {
    children: React.ReactNode
}
export const DashboardScroll = ({ children }: Props) => {
    const [scrollButtons, setScrollButtons] = useState({
        left: false,
        right: true
    })
    const scrollRef = useRef<HTMLDivElement>(null)
    return (
        <Container>
            <div>
                <ButtonScroll
                    className="md-button md-button--icon scroll-button"
                    disabled={!scrollButtons.left}
                    onClick={() => {
                        scrollRef.current?.scrollBy({
                            left: -300,
                            behavior: 'smooth'
                        })
                    }}
                >
                    <i className="mdi mdi-chevron-left"></i>
                </ButtonScroll>
            </div>
            <ContainerScroll
                onScroll={(e) => {
                    const scrollLeft = scrollRef.current?.scrollLeft
                    const scrollWidth = scrollRef.current?.scrollWidth
                    const clientWidth = scrollRef.current?.clientWidth
                    if (
                        typeof scrollLeft !== 'number' ||
                        !scrollWidth ||
                        !clientWidth
                    )
                        return
                    if (scrollLeft === 0) {
                        setScrollButtons({
                            left: false,
                            right: true
                        })
                        return
                    }
                    if (scrollLeft + clientWidth === scrollWidth) {
                        setScrollButtons({
                            left: true,
                            right: false
                        })
                    } else {
                        setScrollButtons({
                            left: true,
                            right: true
                        })
                    }
                }}
                ref={scrollRef}
            >
                {children}
            </ContainerScroll>
            <div>
                <ButtonScroll
                    onClick={() => {
                        scrollRef.current?.scrollBy({
                            left: 300,
                            behavior: 'smooth'
                        })
                    }}
                    disabled={!scrollButtons.right}
                    className="md-button md-button--icon scroll-button"
                >
                    <i className="mdi mdi-chevron-right"></i>
                </ButtonScroll>
            </div>
        </Container>
    )
}
