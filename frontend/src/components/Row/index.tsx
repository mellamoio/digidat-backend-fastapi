import type { ReactNode } from "react"
import { RowStyled } from "./index.styled"
interface Props {
    children: ReactNode
    flex?: number
    minWidth?: string
    reverse?: boolean
    justify?: string
    pointer?: boolean
    hide?: boolean
}
export const Row = (props: Props) => {
    return (
        <RowStyled {...props} />
    )
}