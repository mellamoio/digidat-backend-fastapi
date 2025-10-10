import { TabButtonStyled } from "./index.styled"
interface Props {
    active?: boolean,
    handleClick?: () => void,
    name: string,
    dataId?: string,
}
export const TabButtonItem = ({ name, active, dataId, handleClick }: Props) => {
    return (
        <TabButtonStyled data-id={dataId} onClick={handleClick} active={active}>
            {
                name
            }
        </TabButtonStyled>
    )
}