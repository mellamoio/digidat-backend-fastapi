import type { ReactNode } from "react"
import { ColumnStyled } from "./index.styled"
interface Props {
    children: ReactNode
    flex?: number
    minW?: string
    opacity?: number
    gap?: number,
    maxHeight?: string,
    height?: string,
    scroll?: boolean,
    id?: string,
    padding?: string
}
export const Column = ({ children, flex, minW, opacity, gap, maxHeight, height, scroll, id, padding }: Props) => {
    return (
        <ColumnStyled id={id} height={height} padding={padding} scroll={scroll} flex={flex} minWidth={minW} gap={gap} opacity={opacity} maxHeight={maxHeight}>
            {
                children
            }
        </ColumnStyled>
    )
}