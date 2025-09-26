import { useNavigate } from "react-router-dom";

interface SettingsButtonProps {
    path: string;
}

export const BotonConfig: React.FC<SettingsButtonProps> = ({ path }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    };

    return <button onClick={handleClick}>Ir a Ajustes</button>;
};
