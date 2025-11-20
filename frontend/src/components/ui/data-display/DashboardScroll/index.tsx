import React, { useRef, useState, useEffect } from 'react';
import { Container, ButtonScroll, ContainerScroll } from './index.styled';

interface Props {
    children: React.ReactNode;
}

export const DashboardScroll = ({ children }: Props) => {
    const [scrollButtons, setScrollButtons] = useState({
        left: false,
        right: true
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtStart = scrollLeft === 0;
        const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1;

        setScrollButtons({
            left: !isAtStart,
            right: !isAtEnd
        });
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        
        const scrollAmount = 300;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });

        setTimeout(checkScroll, 300);
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            const timer = setTimeout(checkScroll, 100);
            
            currentRef.addEventListener('scroll', checkScroll);
            const resizeObserver = new ResizeObserver(checkScroll);
            resizeObserver.observe(currentRef);
            
            return () => {
                clearTimeout(timer);
                currentRef.removeEventListener('scroll', checkScroll);
                resizeObserver.disconnect();
            };
        }
    }, []);

    return (
        <Container>
            <ButtonScroll
                className="left"
                onClick={() => scroll('left')}
                disabled={!scrollButtons.left}
            />
            
            <ContainerScroll ref={scrollRef}>
                {children}
            </ContainerScroll>

            <ButtonScroll
                className="right"
                onClick={() => scroll('right')}
                disabled={!scrollButtons.right}
            />
        </Container>
    );
};

export default DashboardScroll;