import { Tooltip } from "antd";
import { AnchorButton } from "./index.styled";

export const SettingsButton = () => {
  const handleClick = () => {
    const windowAny = window as any;
    const baseUrl = windowAny.SESSION_OBJ?.url
    window.location.href = `${baseUrl}digidat/ajustes`;
  };

  return (
    <Tooltip title="Ajustes" placement="top">
      <AnchorButton onClick={handleClick} data-action="cambiarAjustes">
        <i className="mdi mdi-settings mdi-18px"></i>
      </AnchorButton>
    </Tooltip>
  );
};