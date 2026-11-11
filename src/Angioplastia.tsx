import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { C } from "./estilo";
import { framesEscena } from "./tiempos";
import { E01Coro, E02Autopista, E03Placa, E04Ayuda, E05Rescate } from "./escenas-a";
import { Contactos, E06Mapa, E07Globito, E08Stent, E09Fluye, E10Final, E11Cierre } from "./escenas-b";

export type PropsAngioplastia = { contactos: Contactos };

export const Angioplastia: React.FC<PropsAngioplastia> = ({ contactos }) => (
  <AbsoluteFill style={{ background: C.fondo }}>
    <Series>
      <Series.Sequence name="1. Coro" durationInFrames={framesEscena("e01-coro")}>
        <E01Coro />
      </Series.Sequence>
      <Series.Sequence name="2. La autopista" durationInFrames={framesEscena("e02-autopista")}>
        <E02Autopista />
      </Series.Sequence>
      <Series.Sequence name="3. Don Placa" durationInFrames={framesEscena("e03-placa")}>
        <E03Placa />
      </Series.Sequence>
      <Series.Sequence name="4. Coro pide ayuda" durationInFrames={framesEscena("e04-ayuda")}>
        <E04Ayuda />
      </Series.Sequence>
      <Series.Sequence name="5. Equipo de rescate" durationInFrames={framesEscena("e05-rescate")}>
        <E05Rescate />
      </Series.Sequence>
      <Series.Sequence name="6. Mapa iluminado" durationInFrames={framesEscena("e06-mapa")}>
        <E06Mapa />
      </Series.Sequence>
      <Series.Sequence name="7. ¡Fuuum!" durationInFrames={framesEscena("e07-globito")}>
        <E07Globito />
      </Series.Sequence>
      <Series.Sequence name="8. Capitán Stent" durationInFrames={framesEscena("e08-stent")}>
        <E08Stent />
      </Series.Sequence>
      <Series.Sequence name="9. Vuelve a fluir" durationInFrames={framesEscena("e09-fluye")}>
        <E09Fluye />
      </Series.Sequence>
      <Series.Sequence name="10. Final feliz" durationInFrames={framesEscena("e10-final")}>
        <E10Final />
      </Series.Sequence>
      <Series.Sequence name="11. Cierre C-Cardio" durationInFrames={framesEscena("e11-cierre")}>
        <E11Cierre contactos={contactos} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
