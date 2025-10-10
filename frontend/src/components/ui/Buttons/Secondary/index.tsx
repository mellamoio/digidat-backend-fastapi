import { Button } from "antd"
interface Props {
    label: string
    handleClick?: () => void
}
export const ButtonSecondary = ({ label, handleClick }: Props) => {
    return (
        <Button style={{
            backgroundColor: '#E2E2E2',
            color: '#868686'
        }} onClick={handleClick} type="primary">
            {
                label
            }
        </Button>
    )
}