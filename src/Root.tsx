import { Composition } from "remotion";
import { ReelAngioplastia } from "./reel/Reel";
import { DURACION_REEL, FPS_REEL, fuentesReel } from "./reel/base";
import { Angioplastia, PropsAngioplastia } from "./Angioplastia";
import { fuentesListas } from "./estilo";
import { DURACION_TOTAL, FPS } from "./tiempos";

// Asegura que la fuente esté cargada antes de renderizar.
fuentesListas.catch((e) => console.error("No se pudo cargar la fuente", e));
fuentesReel.catch((e) =>
  console.error("No se pudo cargar la fuente del reel", e),
);

const contactos: PropsAngioplastia["contactos"] = {
  telefono: "", // [completar]
  instagram: "", // [completar]
  facebook: "C-Cardio",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelAngioplastia"
        component={ReelAngioplastia}
        durationInFrames={DURACION_REEL}
        fps={FPS_REEL}
        width={1080}
        height={1920}
        defaultProps={{ facebook: "C-Cardio" }}
      />
      <Composition
        id="Angioplastia"
        component={Angioplastia}
        durationInFrames={DURACION_TOTAL}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ contactos }}
      />
    </>
  );
};
