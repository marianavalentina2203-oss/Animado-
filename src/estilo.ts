import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  fondo: "#FFFFFF",
  fondoSuave: "#F3F6FB",
  marino: "#1B2A5C",
  marinoClaro: "#34478A",
  rojo: "#E63946",
  rojoOscuro: "#B4202E",
  rosa: "#F6B3C0",
  rosaOscuro: "#E58A9E",
  pared: "#F9D3DB",
  amarillo: "#F2C14E",
  amarilloOscuro: "#C9962A",
  blanco: "#FFFFFF",
  gris: "#8A94A6",
  grisClaro: "#DDE3EC",
  verde: "#2BB673",
  cian: "#7FE7FF",
  piel: "#F2C6A0",
  pielOscura: "#D9A47C",
};

export const FUENTE = "Nunito";

const pesos = ["400", "700", "800", "900"] as const;
export const fuentesListas = Promise.all(
  pesos.map((w) =>
    loadFont({
      family: FUENTE,
      url: staticFile(`fonts/nunito-latin-${w}-normal.woff2`),
      weight: w,
    }),
  ),
);
