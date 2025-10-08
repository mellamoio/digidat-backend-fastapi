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

        // Verificar posición después de completar el desplazamiento
        setTimeout(checkScroll, 300);
    };

    // Verificar posición al montar y al cambiar el tamaño
    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            // Verificación inicial con retraso para asegurar que el DOM esté listo
            const timer = setTimeout(checkScroll, 100);
            
            // Event listeners
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