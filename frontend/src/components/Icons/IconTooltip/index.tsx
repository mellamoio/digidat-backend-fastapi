import { Tooltip } from "antd"
import { SpanStyled } from "./index.styled"
interface Props {
    tooltip: string,
    icon: string
}
export const IconTooltip = ({ icon, tooltip }: Props) => {
    return (
        <Tooltip title={tooltip} >
            <SpanStyled >
                <i className={icon} ></i>
            </SpanStyled>
        </Tooltip>
    )
}