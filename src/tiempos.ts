import tiemposJson from "./tiempos.json";

export type Frase = { texto: string; voz: string; inicio: number; fin: number };
export type TiempoEscena = { duracion: number; frases: Frase[] };

export const TIEMPOS = tiemposJson as Record<string, TiempoEscena>;

export const ESCENAS = [
  "e01-coro",
  "e02-autopista",
  "e03-placa",
  "e04-ayuda",
  "e05-rescate",
  "e06-mapa",
  "e07-globito",
  "e08-stent",
  "e09-fluye",
  "e10-final",
  "e11-cierre",
] as const;

export type EscenaId = (typeof ESCENAS)[number];

export const FPS = 30;

export const framesEscena = (id: EscenaId) => Math.ceil(TIEMPOS[id].duracion * FPS);

export const DURACION_TOTAL = ESCENAS.reduce((acc, id) => acc + framesEscena(id), 0);

/** Frame (relativo a la escena) en que empieza la frase n. */
export const inicioFrase = (id: EscenaId, n: number) =>
  Math.round(TIEMPOS[id].frases[n].inicio * FPS);

export const finFrase = (id: EscenaId, n: number) =>
  Math.round(TIEMPOS[id].frases[n].fin * FPS);

/** Frame en que se pronuncia (aprox.) una palabra dentro de una frase. */
export const framePalabra = (id: EscenaId, n: number, palabra: string) => {
  const f = TIEMPOS[id].frases[n];
  const pos = f.texto.toLowerCase().indexOf(palabra.toLowerCase());
  const frac = pos < 0 ? 0 : pos / f.texto.length;
  return Math.round((f.inicio + frac * (f.fin - f.inicio)) * FPS);
};
