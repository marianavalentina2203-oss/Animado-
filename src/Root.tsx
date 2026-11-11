import { Composition } from "remotion";
import { Angioplastia, PropsAngioplastia } from "./Angioplastia";
import { fuentesListas } from "./estilo";
import { DURACION_TOTAL, FPS } from "./tiempos";

// Asegura que la fuente esté cargada antes de renderizar.
fuentesListas.catch((e) => console.error("No se pudo cargar la fuente", e));

const contactos: PropsAngioplastia["contactos"] = {
  telefono: "", // [completar]
  instagram: "", // [completar]
  facebook: "C-Cardio",
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Angioplastia"
      component={Angioplastia}
      durationInFrames={DURACION_TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ contactos }}
    />
  );
};
