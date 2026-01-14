import React, { useState } from "react";
import { SeccionHeader, IconoFlecha } from "./index.styled";
import type { SeccionDesplegableProps } from "../../Dashboard/types/seccion_desplegable";

const SeccionDesplegable: React.FC<SeccionDesplegableProps> = ({
  titulo,
  fechaInicio,
  fechaFin,
  initialOpen = false,
}) => {
  const [abierto, setAbierto] = useState(initialOpen);

  return (
      <SeccionHeader onClick={() => setAbierto(!abierto)}>
        <IconoFlecha abierto={abierto}>▶</IconoFlecha>
        {titulo}
        {fechaInicio && fechaFin && <span>{fechaInicio} - {fechaFin}</span>}
      </SeccionHeader>
  );
};

export default SeccionDesplegable;