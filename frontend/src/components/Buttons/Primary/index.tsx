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
            height: '34px'
        }} loading={loading} onClick={handleClick} {...props} type="primary">
            {
                label
            }
        </Button>
    )
}