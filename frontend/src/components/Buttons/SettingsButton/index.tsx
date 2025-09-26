import { Tooltip } from "antd"
import { AnchorButton } from "./index.styled"

// The SESSION_OBJ type is now globally available from types/session.d.ts

interface Props {
    path: string;
}

export const SettingsButton = ({ path }: Props) => {
    const baseUrl = window.SESSION_OBJ?.url || '';
    
    return (
        <Tooltip title="Ajustes" placement="top">
            <AnchorButton href={`${baseUrl}${path}`} data-action="cambiarAjustes">
                <i className="mdi mdi-settings mdi-18px"></i>
            </AnchorButton>
        </Tooltip>
    )
}