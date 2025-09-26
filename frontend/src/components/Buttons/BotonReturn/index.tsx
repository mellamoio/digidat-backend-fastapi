import React from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { ReturnButton } from "./index.styled";

const BotonReturn: React.FC = () => {
    const navigate = useNavigate();

    return (
        <ReturnButton onClick={() => navigate(-1)}>
            <LeftOutlined /> Volver
        </ReturnButton>
    );
};

export default BotonReturn;
