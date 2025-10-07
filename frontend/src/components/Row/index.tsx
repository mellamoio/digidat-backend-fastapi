import type { CSSProperties, ReactNode } from "react"
import { RowStyled } from "./index.styled"

interface Props {
    children: ReactNode
    flex?: number
    minWidth?: string
    reverse?: boolean
    justify?: string
    pointer?: boolean
    hide?: boolean
    style?: CSSProperties
}

export const Row = (props: Props) => {
    const { style, ...rest } = props;
    return (
        <RowStyled style={style} {...rest} />
    )
}