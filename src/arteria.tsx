import React from "react";
import { C } from "./estilo";

/** Medidas de la arteria vista de cerca (en px del lienzo 1080×1920). */
export const ART = {
  arriba: 560, // borde superior del interior
  abajo: 960, // borde inferior del interior
  pared: 64,
  get centro() {
    return (this.arriba + this.abajo) / 2;
  },
};

/** Tramo de arteria horizontal, con carriles que se desplazan según `avance`. */
export const Arteria: React.FC<{ avance?: number; estrechez?: number }> = ({ avance = 0 }) => {
  const rayas: React.ReactNode[] = [];
  const paso = 140;
  const off = -((avance % paso) + paso) % paso;
  for (let x = off - paso; x < 1200; x += paso) {
    rayas.push(<rect key={x} x={x} y={ART.centro - 6} width={70} height={12} rx={6} fill={C.blanco} opacity={0.8} />);
  }
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="lumen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FCE3E8" />
          <stop offset="1" stopColor="#F8CCD6" />
        </linearGradient>
      </defs>
      <rect x={0} y={ART.arriba - ART.pared} width={1080} height={ART.pared} fill={C.rosaOscuro} />
      <rect x={0} y={ART.abajo} width={1080} height={ART.pared} fill={C.rosaOscuro} />
      <rect x={0} y={ART.arriba - ART.pared} width={1080} height={10} fill="#D06E85" />
      <rect x={0} y={ART.abajo + ART.pared - 10} width={1080} height={10} fill="#D06E85" />
      <rect x={0} y={ART.arriba} width={1080} height={ART.abajo - ART.arriba} fill="url(#lumen)" />
      {rayas}
    </svg>
  );
};
