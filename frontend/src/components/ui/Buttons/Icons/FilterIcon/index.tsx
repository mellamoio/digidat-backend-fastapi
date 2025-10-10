interface Props {
    color: string
    backgroundColor: string
}
export const FilterIcon = ({ backgroundColor, color }: Props) => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="18" height="18" rx="2" fill={backgroundColor} />
            <path fillRule="evenodd" clipRule="evenodd" d="M5.49749 9.95695L2.09658 4.05788C1.82795 3.59192 2.15153 3 2.67489 3L11.3251 3C11.8485 3 12.1721 3.59192 11.9034 4.05788L8.50475 9.95307V13.1888C8.50475 13.4262 8.38858 13.6474 8.19628 13.7761L6.53672 14.8872C6.08832 15.1874 5.49749 14.8534 5.49749 14.2998V9.95695Z" fill={color} />
            <path d="M12 9L16 6L16 12L12 9Z" fill={color} />
        </svg>

    )
}