import { Tooltip } from "antd"
import { SettingOutlined } from '@ant-design/icons'
import { AnchorButton } from "./index.styled"

interface SettingsButtonProps {
    path: string;
    tooltip?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({
    path,
    tooltip = "Ajustes",
    icon = <SettingOutlined />,
    className
}) => {
    const baseUrl = window.SESSION_OBJ?.url || '';

    return (
        <Tooltip title={tooltip} placement="top">
            <AnchorButton
                href={`${baseUrl}${path}`}
                data-action="cambiarAjustes"
                className={className}
            >
                {icon}
            </AnchorButton>
        </Tooltip>
    )
}