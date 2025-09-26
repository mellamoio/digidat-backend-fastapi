import type { ReactNode } from "react"
import { GroupTabButtonsStyled } from "./index.styled"
interface Props {
    children: ReactNode
}
export const GroupTabButtons = ({
    children
}: Props) => {
    return (
        <GroupTabButtonsStyled >
            {children}
        </GroupTabButtonsStyled>
    )
}