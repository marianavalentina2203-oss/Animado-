import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { C, FUENTE } from "./estilo";
import { EscenaId, FPS, TIEMPOS } from "./tiempos";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 con rebote suave a partir del frame `desde` (función pura, se puede usar en condicionales). */
export const pop = (frame: number, desde: number, damping = 12) =>
  spring({ frame: frame - desde, fps: FPS, config: { damping, stiffness: 140, mass: 0.7 } });

/** interpolate con clamp en ambos extremos. */
export const iv = (
  frame: number,
  entrada: [number, number],
  salida: [number, number],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) => interpolate(frame, [entrada[0], Math.max(entrada[1], entrada[0] + 1)], salida, { ...clamp, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Latido doble (lub-dub) que devuelve un factor de escala ≥ 1. */
export const latido = (frame: number, periodo = 24, fuerza = 1) => {
  const p = (frame % periodo) / periodo;
  let v = 0;
  if (p < 0.14) v = Math.sin((p / 0.14) * Math.PI) * 0.07;
  else if (p > 0.2 && p < 0.34) v = Math.sin(((p - 0.2) / 0.14) * Math.PI) * 0.045;
  return 1 + v * fuerza;
};

// ---------- Subtítulos ----------

type Trozo = { texto: string; inicio: number; fin: number; voz: string };

const MAX_CARACTERES = 44;

/** Divide cada frase en trozos legibles y reparte su tiempo según la cantidad de letras. */
const trozosDe = (id: EscenaId): Trozo[] => {
  const out: Trozo[] = [];
  for (const f of TIEMPOS[id].frases) {
    const palabras = f.texto.split(" ");
    const lineas: string[] = [];
    let actual = "";
    for (const p of palabras) {
      const prueba = actual ? `${actual} ${p}` : p;
      if (prueba.length > MAX_CARACTERES && actual) {
        lineas.push(actual);
        actual = p;
      } else {
        actual = prueba;
      }
    }
    if (actual) lineas.push(actual);
    // Evita una última línea de una sola palabra.
    if (lineas.length > 1 && lineas[lineas.length - 1].split(" ").length === 1) {
      const ultima = lineas.pop()!;
      lineas[lineas.length - 1] += ` ${ultima}`;
    }
    const total = lineas.reduce((a, l) => a + l.length, 0);
    let t = f.inicio;
    for (const l of lineas) {
      const d = ((f.fin - f.inicio) * l.length) / total;
      out.push({ texto: l, inicio: t, fin: t + d, voz: f.voz });
      t += d;
    }
  }
  return out;
};

export const Subtitulos: React.FC<{ id: EscenaId }> = ({ id }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const trozos = trozosDe(id);
  // Se mantiene el último trozo visible durante las pausas cortas.
  let actual: Trozo | null = null;
  for (const tr of trozos) {
    if (t >= tr.inicio - 0.05 && t < tr.fin + 0.45) actual = tr;
  }
  if (!actual) return null;
  const entrada = spring({
    frame: frame - Math.round(actual.inicio * fps),
    fps,
    config: { damping: 18, stiffness: 220 },
  });
  const esCoro = actual.voz === "coro";
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1395,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: esCoro ? C.rojo : C.marino,
          color: C.blanco,
          fontFamily: FUENTE,
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.18,
          textAlign: "center",
          padding: "26px 40px",
          borderRadius: 34,
          maxWidth: 940,
          boxShadow: "0 12px 30px rgba(27,42,92,0.25)",
          scale: interpolate(entrada, [0, 1], [0.92, 1]),
          opacity: interpolate(entrada, [0, 0.6], [0, 1], clamp),
        }}
      >
        {esCoro ? "Coro: " : ""}
        {actual.texto}
      </div>
    </div>
  );
};

// ---------- Rótulo (palabra clave grande) ----------

export const Rotulo: React.FC<{ texto: string; desde: number; top?: number }> = ({
  texto,
  desde,
  top = 1170,
}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, desde, 10);
  if (frame < desde) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: FUENTE,
          fontWeight: 900,
          fontSize: texto.length > 22 ? 58 : 84,
          color: C.marino,
          background: C.blanco,
          border: `8px solid ${C.marino}`,
          borderRadius: 999,
          padding: texto.length > 22 ? "14px 40px" : "10px 56px",
          letterSpacing: 0.5,
          scale: p,
          rotate: `${interpolate(p, [0, 1], [-8, -2])}deg`,
          boxShadow: `0 10px 0 ${C.rojo}`,
          whiteSpace: "nowrap",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// ---------- Marca superior ----------

export const CorazonLogo: React.FC<{ size: number; color?: string }> = ({ size, color = C.rojo }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 88 C20 66 6 48 10 30 C14 14 34 8 50 26 C66 8 86 14 90 30 C94 48 80 66 50 88 Z"
      fill={color}
    />
    <path d="M22 46 h14 l6 -12 l8 24 l6 -12 h22" stroke={C.blanco} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Marca: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 90,
      left: 80,
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontFamily: FUENTE,
      fontWeight: 900,
      fontSize: 44,
      color: C.marino,
    }}
  >
    <CorazonLogo size={60} />
    <span>
      C-<span style={{ color: C.rojo }}>Cardio</span>
    </span>
  </div>
);

// ---------- Contenedor de cada escena ----------

export const Escena: React.FC<{
  id: EscenaId;
  fondo?: string;
  marca?: boolean;
  children: React.ReactNode;
}> = ({ id, fondo = C.fondo, marca = true, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacidad = interpolate(frame, [0, 8, durationInFrames - 6, durationInFrames], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: fondo, fontFamily: FUENTE }}>
      <AbsoluteFill style={{ opacity: opacidad }}>{children}</AbsoluteFill>
      {marca ? <Marca /> : null}
      <Subtitulos id={id} />
      <Audio src={staticFile(`voz/${id}.mp3`)} />
    </AbsoluteFill>
  );
};

/** Coloca un elemento centrado en (x, y) del lienzo 1080×1920. */
export const En: React.FC<{
  x: number;
  y: number;
  escala?: number;
  rot?: number;
  opacidad?: number;
  z?: number;
  children: React.ReactNode;
}> = ({ x, y, escala = 1, rot = 0, opacidad = 1, z, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      width: "max-content",
      scale: escala,
      rotate: `${rot}deg`,
      opacity: opacidad,
      zIndex: z,
    }}
  >
    {children}
  </div>
);

export const Burbuja: React.FC<{
  texto: string;
  color?: string;
  fondo?: string;
  size?: number;
}> = ({ texto, color = C.marino, fondo = C.blanco, size = 44 }) => (
  <div
    style={{
      fontFamily: FUENTE,
      fontWeight: 900,
      fontSize: size,
      color,
      background: fondo,
      border: `5px solid ${color}`,
      borderRadius: 30,
      padding: "10px 26px",
      whiteSpace: "nowrap",
      boxShadow: "0 6px 0 rgba(27,42,92,0.18)",
    }}
  >
    {texto}
  </div>
);
