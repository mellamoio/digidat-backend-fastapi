import { Button } from "antd"
interface Props {
    label: string
    onClick?: () => void;
    handleClick?: () => void
    loading?: boolean
}
export const ButtonPrimary = ({ label, handleClick, loading, ...props }: Props) => {
    return (
        <Button style={{
            backgroundColor: '#722AE9',
            color: 'white',
            height: '34px',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            transition: 'all 0.1s ease-in-out'
        }}
        onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.opacity = '0.9';
        }}
        onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '1';
        }}
        loading={loading} onClick={handleClick} {...props} type="primary">
            {
                label
            }
        </Button>
    )
}