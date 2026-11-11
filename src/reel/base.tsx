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
import { loadFont } from "@remotion/fonts";
import tiemposJson from "./tiempos.json";

// ---------- Estilo ----------

export const R = {
  crema: "#F7F1DE",
  punto: "#E7DDC0",
  marino: "#1B2A5C",
  azul: "#2F5DA8",
  celeste: "#9CCBEB",
  amarillo: "#F6B826",
  rojo: "#E63946",
  rosa: "#F4A9B8",
  rosaPared: "#E57D96",
  grasa: "#F2C14E",
  verde: "#3DA35D",
  piel: "#F3C9A3",
  gris: "#B8B09A",
  blanco: "#FFFFFF",
  papel: "#FFFDF6",
};

export const TRAZO = 6;
export const SANS = "Inter";
export const MONO = "JetBrains Mono";

export const fuentesReel = Promise.all([
  ...(["700", "800", "900"] as const).map((w) =>
    loadFont({
      family: SANS,
      url: staticFile(`fonts/inter-latin-${w}-normal.woff2`),
      weight: w,
    }),
  ),
  loadFont({
    family: MONO,
    url: staticFile("fonts/jetbrains-mono-latin-700-normal.woff2"),
    weight: "700",
  }),
]);

// ---------- Tiempos ----------

export type Palabra = { w: string; inicio: number; fin: number };
export type Plano = {
  id: string;
  etiqueta: string;
  texto: string;
  inicio: number;
  fin: number;
  palabras: Palabra[];
};

export const REEL = tiemposJson as { duracion: number; planos: Plano[] };
export const FPS_REEL = 30;
export const DURACION_REEL = Math.ceil(REEL.duracion * FPS_REEL);

export const plano = (id: string) => {
  const p = REEL.planos.find((x) => x.id === id);
  if (!p) throw new Error(`No existe el plano ${id}`);
  return p;
};

/** Frame de inicio de un plano (absoluto en el video). */
export const desdePlano = (id: string) =>
  id === REEL.planos[0].id ? 0 : Math.round(plano(id).inicio * FPS_REEL) - 3;

/** Duración en frames de un plano: hasta que empieza el siguiente. */
export const largoPlano = (id: string) => {
  const i = REEL.planos.findIndex((x) => x.id === id);
  const fin =
    i === REEL.planos.length - 1
      ? DURACION_REEL
      : desdePlano(REEL.planos[i + 1].id);
  return fin - desdePlano(id);
};

/** Frame (relativo al plano) en que se dice la palabra que contiene `trozo`. */
export const enPalabra = (id: string, trozo: string, n = 0) => {
  const p = plano(id);
  const hits = p.palabras.filter((x) =>
    x.w.toLowerCase().includes(trozo.toLowerCase()),
  );
  const w = hits[Math.min(n, hits.length - 1)] ?? p.palabras[0];
  return Math.round(w.inicio * FPS_REEL) - desdePlano(id);
};

// ---------- Utilidades de animación ----------

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const brote = (frame: number, desde: number, damping = 13) =>
  spring({
    frame: frame - desde,
    fps: FPS_REEL,
    config: { damping, stiffness: 170, mass: 0.6 },
  });

export const tramo = (
  frame: number,
  [a, b]: [number, number],
  [x, y]: [number, number],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) => interpolate(frame, [a, Math.max(b, a + 1)], [x, y], { ...clamp, easing });

/** Coloca un elemento centrado en (x, y). */
export const Pos: React.FC<{
  x: number;
  y: number;
  s?: number;
  r?: number;
  o?: number;
  children: React.ReactNode;
}> = ({ x, y, s = 1, r = 0, o = 1, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      width: "max-content",
      scale: s,
      rotate: `${r}deg`,
      opacity: o,
    }}
  >
    {children}
  </div>
);

// ---------- Fondo, insignia, etiqueta ----------

export const Fondo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: R.crema,
      backgroundImage: `radial-gradient(${R.punto} 3px, transparent 3.5px)`,
      backgroundSize: "36px 36px",
    }}
  />
);

export const CorazonMarca: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 88 C20 66 6 48 10 30 C14 14 34 8 50 26 C66 8 86 14 90 30 C94 48 80 66 50 88 Z"
      fill={R.rojo}
      stroke={R.marino}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path
      d="M22 46 h14 l6 -12 l8 24 l6 -12 h22"
      stroke={R.blanco}
      strokeWidth={7}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Insignia: React.FC<{ escala?: number }> = ({ escala = 1 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10 * escala,
      background: R.blanco,
      border: `${5 * escala}px solid ${R.marino}`,
      borderRadius: 999,
      padding: `${8 * escala}px ${26 * escala}px ${8 * escala}px ${14 * escala}px`,
      rotate: "-6deg",
      boxShadow: `${5 * escala}px ${5 * escala}px 0 ${R.marino}`,
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: 42 * escala,
      color: R.marino,
      letterSpacing: -0.5,
    }}
  >
    <CorazonMarca size={54 * escala} />
    <span>
      C-<span style={{ color: R.rojo }}>Cardio</span>
    </span>
  </div>
);

export const Etiqueta: React.FC<{ texto: string; desde: number }> = ({
  texto,
  desde,
}) => {
  const f = useCurrentFrame();
  const p = brote(f, desde, 16);
  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: R.marino,
          color: R.blanco,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 4,
          padding: "8px 22px",
          scale: interpolate(p, [0, 1], [0.6, 1]),
          opacity: p,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// ---------- Subtítulos palabra por palabra ----------

type Linea = Palabra[];

const MAX_LINEA = 24;

const lineasDe = (palabras: Palabra[]): Linea[] => {
  const out: Linea[] = [];
  let actual: Linea = [];
  let largo = 0;
  for (const p of palabras) {
    if (actual.length && largo + p.w.length + 1 > MAX_LINEA) {
      out.push(actual);
      actual = [];
      largo = 0;
    }
    actual.push(p);
    largo += p.w.length + 1;
    // Corta después de un punto o signo de interrogación para no mezclar ideas.
    if (/[.?!:…]$/.test(p.w)) {
      out.push(actual);
      actual = [];
      largo = 0;
    }
  }
  if (actual.length) out.push(actual);
  return out;
};

const TODAS_LAS_LINEAS: Linea[] = REEL.planos.flatMap((p) =>
  lineasDe(p.palabras),
);

export const Subtitulos: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS_REEL;
  let linea: Linea | null = null;
  for (const l of TODAS_LAS_LINEAS) {
    if (t >= l[0].inicio - 0.08) linea = l;
  }
  if (!linea || t > linea[linea.length - 1].fin + 0.6) return null;
  const entrada = brote(f, Math.round((linea[0].inicio - 0.08) * FPS_REEL), 18);
  return (
    <div
      style={{
        position: "absolute",
        top: 1220,
        left: 80,
        right: 80,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 18,
        rowGap: 10,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 68,
        letterSpacing: -1,
        lineHeight: 1.15,
        translate: `0 ${interpolate(entrada, [0, 1], [18, 0])}px`,
        opacity: entrada,
      }}
    >
      {linea.map((p, i) => {
        const dicha = t >= p.inicio - 0.03;
        const siguiente = linea[i + 1];
        const actual = dicha && (siguiente ? t < siguiente.inicio - 0.03 : t < p.fin + 0.25);
        return (
          <span
            key={`${p.w}-${i}`}
            style={{
              color: dicha ? R.marino : "#BDB49A",
              background: actual ? R.amarillo : "transparent",
              boxShadow: actual ? `5px 5px 0 ${R.marino}` : "none",
              padding: "0 10px",
              margin: "0 -10px",
              rotate: actual ? "-1.5deg" : "0deg",
            }}
          >
            {p.w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Barra de progreso con cuenta regresiva ----------

export const Progreso: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const avance = f / durationInFrames;
  const restante = Math.max(0, Math.ceil((durationInFrames - f) / FPS_REEL));
  const ancho = 760;
  return (
    <div
      style={{
        position: "absolute",
        top: 1450,
        left: (1080 - ancho) / 2,
        width: ancho,
        height: 60,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 0,
          right: 0,
          height: 8,
          borderRadius: 4,
          background: "#DDD3B8",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 0,
          width: ancho * avance,
          height: 8,
          borderRadius: 4,
          background: R.azul,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: ancho * avance - 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: R.blanco,
          border: `5px solid ${R.azul}`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 24,
          color: R.marino,
        }}
      >
        {restante}
      </div>
    </div>
  );
};

/** Entrada de cada plano: un pequeño salto y un leve acercamiento continuo. */
export const Escenario: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const entrada = brote(f, 0, 15);
  return (
    <AbsoluteFill
      style={{
        scale:
          interpolate(entrada, [0, 1], [0.94, 1]) *
          interpolate(f, [0, durationInFrames], [1, 1.035]),
        opacity: interpolate(entrada, [0, 0.5], [0, 1], clamp),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
