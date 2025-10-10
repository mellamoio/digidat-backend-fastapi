import { Container } from './index.styled';

interface Props {
    title: string;
    total: number;
    variant?: 'regular' | 'money' | 'percentage';
    pagos_reembolsables?: number;
    simbolo?: string;
}

export const ItemQuantity = ({
    title,
    total,
    simbolo,
    variant = 'regular',
    
}: Props) => {
    const formattedTotal = (() => {
        if (variant === 'money') {
            return `${simbolo ?? ''}${Math.floor(total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
        if (variant === 'percentage') {
            return `${Math.floor(total)}%`;
        }
        return Math.floor(total);
    })();

    return (
        <Container>
            <h5>{title}</h5>
            <h1>{formattedTotal}</h1>
        </Container>
    );
};
