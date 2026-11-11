import React from "react";
import { R, TRAZO } from "./base";

const L = {
  stroke: R.marino,
  strokeWidth: TRAZO,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

// ---------- Personas ----------

type Expresion = "feliz" | "preocupado" | "dolor" | "tranquilo";

const Cara: React.FC<{
  cx: number;
  cy: number;
  expresion: Expresion;
  bigote?: boolean;
}> = ({ cx, cy, expresion, bigote }) => (
  <g>
    <circle cx={cx - 18} cy={cy - 4} r={6} fill={R.marino} />
    <circle cx={cx + 18} cy={cy - 4} r={6} fill={R.marino} />
    {expresion === "preocupado" || expresion === "dolor" ? (
      <>
        <path
          d={`M${cx - 30} ${cy - 22} L ${cx - 10} ${cy - 16}`}
          {...L}
          strokeWidth={5}
        />
        <path
          d={`M${cx + 30} ${cy - 22} L ${cx + 10} ${cy - 16}`}
          {...L}
          strokeWidth={5}
        />
      </>
    ) : null}
    {bigote ? (
      <path
        d={`M${cx - 24} ${cy + 18} Q ${cx - 12} ${cy + 8} ${cx} ${cy + 16} Q ${cx + 12} ${cy + 8} ${cx + 24} ${cy + 18} Q ${cx} ${cy + 26} ${cx - 24} ${cy + 18} Z`}
        fill="#8A8A8A"
        stroke={R.marino}
        strokeWidth={4}
      />
    ) : null}
    {expresion === "feliz" || expresion === "tranquilo" ? (
      <path
        d={`M${cx - 16} ${cy + (bigote ? 28 : 18)} Q ${cx} ${cy + (bigote ? 40 : 34)} ${cx + 16} ${cy + (bigote ? 28 : 18)}`}
        {...L}
        strokeWidth={5}
        fill="none"
      />
    ) : expresion === "dolor" ? (
      <path
        d={`M${cx - 14} ${cy + 32} q 7 -6 14 0 q 7 6 14 0`}
        {...L}
        strokeWidth={5}
        fill="none"
      />
    ) : (
      <path
        d={`M${cx - 14} ${cy + (bigote ? 34 : 26)} Q ${cx} ${cy + (bigote ? 26 : 18)} ${cx + 14} ${cy + (bigote ? 34 : 26)}`}
        {...L}
        strokeWidth={5}
        fill="none"
      />
    )}
  </g>
);

/** Persona de medio cuerpo, al estilo plano de la referencia. */
export const Busto: React.FC<{
  size: number;
  camisa?: string;
  pelo?: string;
  expresion?: Expresion;
  bigote?: boolean;
  gorra?: string;
  canas?: boolean;
  mano?: "papel" | "pecho" | "saludo" | "llave" | "ninguna";
  fase?: number;
}> = ({
  size,
  camisa = R.celeste,
  pelo = "#2E2622",
  expresion = "feliz",
  bigote,
  gorra,
  canas,
  mano = "ninguna",
  fase = 0,
}) => (
  <svg
    width={size}
    height={size * 1.1}
    viewBox="0 0 300 330"
    overflow="visible"
  >
    <path
      d="M40 330 C 40 230, 90 205, 150 205 C 210 205, 260 230, 260 330 Z"
      fill={camisa}
      {...L}
    />
    <path d="M128 205 L150 240 L172 205" fill="none" {...L} strokeWidth={5} />
    <rect x={132} y={176} width={36} height={34} fill={R.piel} {...L} />
    <circle cx={150} cy={120} r={72} fill={R.piel} {...L} />
    {gorra ? (
      <g>
        <path d="M80 104 C 80 40, 220 40, 220 104 Z" fill={gorra} {...L} />
        <path
          d="M200 100 L 262 108 Q 266 116 254 118 L 196 112 Z"
          fill={gorra}
          {...L}
        />
      </g>
    ) : (
      <path
        d={
          canas
            ? "M82 112 C 74 60, 120 40, 150 44 C 190 40, 228 62, 218 112 C 206 84, 186 76, 150 76 C 114 76, 94 84, 82 112 Z"
            : "M80 118 C 70 56, 120 36, 152 40 C 196 38, 232 64, 220 118 C 210 86, 188 72, 150 74 C 112 74, 92 88, 80 118 Z"
        }
        fill={canas ? "#D9D9D9" : pelo}
        {...L}
      />
    )}
    <circle cx={78} cy={128} r={12} fill={R.piel} {...L} />
    <circle cx={222} cy={128} r={12} fill={R.piel} {...L} />
    <Cara cx={150} cy={128} expresion={expresion} bigote={bigote} />
    <circle cx={108} cy={150} r={9} fill="#F29C9C" opacity={0.55} />
    <circle cx={192} cy={150} r={9} fill="#F29C9C" opacity={0.55} />
    {mano === "papel" ? (
      <g transform={`rotate(${-8 + Math.sin(fase) * 2} 230 250)`}>
        <rect
          x={190}
          y={190}
          width={110}
          height={140}
          rx={6}
          fill={R.papel}
          {...L}
        />
        <path
          d="M206 222 h76 M206 246 h60 M206 270 h70"
          {...L}
          strokeWidth={5}
        />
        <rect x={204} y={290} width={80} height={18} rx={4} fill={R.amarillo} />
        <circle cx={196} cy={300} r={18} fill={R.piel} {...L} />
      </g>
    ) : mano === "pecho" ? (
      <circle cx={170} cy={262} r={20} fill={R.piel} {...L} />
    ) : mano === "saludo" ? (
      <g transform={`rotate(${Math.sin(fase) * 12} 250 230)`}>
        <path
          d="M245 240 L 280 150"
          {...L}
          strokeWidth={30}
          stroke={R.marino}
        />
        <path
          d="M245 240 L 280 150"
          stroke={camisa}
          strokeWidth={18}
          strokeLinecap="round"
        />
        <circle cx={283} cy={140} r={20} fill={R.piel} {...L} />
      </g>
    ) : mano === "llave" ? (
      <g transform={`rotate(${Math.sin(fase) * 8} 250 240)`}>
        <path
          d="M250 300 L 290 170"
          stroke={R.gris}
          strokeWidth={16}
          strokeLinecap="round"
        />
        <path
          d="M250 300 L 290 170"
          stroke={R.marino}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M274 150 a 26 26 0 1 0 36 22 l -16 -8 l -2 -18 Z"
          fill={R.gris}
          {...L}
        />
        <circle cx={252} cy={292} r={20} fill={R.piel} {...L} />
      </g>
    ) : null}
  </svg>
);

/** Persona de cuerpo entero (para escaleras y para caminar). */
export const Cuerpo: React.FC<{
  size: number;
  camisa?: string;
  expresion?: Expresion;
  bigote?: boolean;
  canas?: boolean;
  manoPecho?: boolean;
  paso?: number;
  saluda?: number;
}> = ({
  size,
  camisa = R.celeste,
  expresion = "feliz",
  bigote,
  canas,
  manoPecho,
  paso = 0,
  saluda,
}) => {
  const p = Math.sin(paso) * 18;
  return (
    <svg
      width={size}
      height={size * 2}
      viewBox="0 0 200 400"
      overflow="visible"
    >
      <g transform={`rotate(${p} 100 250)`}>
        <rect
          x={74}
          y={240}
          width={26}
          height={120}
          rx={12}
          fill="#3A4A6B"
          {...L}
        />
        <path d="M70 362 h40 v18 h-46 Z" fill={R.marino} />
      </g>
      <g transform={`rotate(${-p} 100 250)`}>
        <rect
          x={100}
          y={240}
          width={26}
          height={120}
          rx={12}
          fill="#3A4A6B"
          {...L}
        />
        <path d="M96 362 h40 v18 h-46 Z" fill={R.marino} />
      </g>
      <path
        d="M52 150 Q 52 120 100 118 Q 148 120 148 150 L 144 260 L 56 260 Z"
        fill={camisa}
        {...L}
      />
      <path
        d={`M58 150 L ${44 - p * 0.5} 240`}
        stroke={R.marino}
        strokeWidth={30}
        strokeLinecap="round"
      />
      <path
        d={`M58 150 L ${44 - p * 0.5} 240`}
        stroke={camisa}
        strokeWidth={18}
        strokeLinecap="round"
      />
      {manoPecho ? (
        <>
          <path
            d="M142 150 Q 150 200 112 190"
            stroke={R.marino}
            strokeWidth={30}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M142 150 Q 150 200 112 190"
            stroke={camisa}
            strokeWidth={18}
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={110} cy={186} r={15} fill={R.piel} {...L} />
        </>
      ) : saluda !== undefined ? (
        <>
          <path
            d={`M142 150 L ${178 + Math.sin(saluda) * 8} 70`}
            stroke={R.marino}
            strokeWidth={30}
            strokeLinecap="round"
          />
          <path
            d={`M142 150 L ${178 + Math.sin(saluda) * 8} 70`}
            stroke={camisa}
            strokeWidth={18}
            strokeLinecap="round"
          />
          <circle
            cx={180 + Math.sin(saluda) * 8}
            cy={62}
            r={15}
            fill={R.piel}
            {...L}
          />
        </>
      ) : (
        <>
          <path
            d={`M142 150 L ${156 + p * 0.5} 240`}
            stroke={R.marino}
            strokeWidth={30}
            strokeLinecap="round"
          />
          <path
            d={`M142 150 L ${156 + p * 0.5} 240`}
            stroke={camisa}
            strokeWidth={18}
            strokeLinecap="round"
          />
        </>
      )}
      <circle cx={100} cy={70} r={48} fill={R.piel} {...L} />
      <path
        d="M54 70 C 50 30, 80 18, 100 20 C 128 18, 152 34, 146 70 C 138 50, 124 44, 100 44 C 76 44, 62 50, 54 70 Z"
        fill={canas ? "#D9D9D9" : "#2E2622"}
        {...L}
      />
      <g transform="translate(100 70) scale(0.66) translate(-150 -128)">
        <Cara cx={150} cy={128} expresion={expresion} bigote={bigote} />
      </g>
    </svg>
  );
};

// ---------- Objetos ----------

export const Cronometro: React.FC<{ size: number; aguja: number }> = ({
  size,
  aguja,
}) => (
  <svg width={size} height={size} viewBox="0 0 240 260" overflow="visible">
    <rect x={100} y={6} width={40} height={26} rx={6} fill={R.rojo} {...L} />
    <rect x={112} y={28} width={16} height={18} fill={R.gris} {...L} />
    <circle cx={120} cy={146} r={104} fill={R.papel} {...L} />
    <path
      d={`M120 146 L120 42 A104 104 0 ${aguja > 0.5 ? 1 : 0} 1 ${120 + 104 * Math.sin(aguja * 2 * Math.PI)} ${146 - 104 * Math.cos(aguja * 2 * Math.PI)} Z`}
      fill={R.amarillo}
      opacity={0.6}
    />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return (
        <line
          key={i}
          x1={120 + Math.sin(a) * 84}
          y1={146 - Math.cos(a) * 84}
          x2={120 + Math.sin(a) * 94}
          y2={146 - Math.cos(a) * 94}
          {...L}
          strokeWidth={5}
        />
      );
    })}
    <line
      x1={120}
      y1={146}
      x2={120 + Math.sin(aguja * 2 * Math.PI) * 76}
      y2={146 - Math.cos(aguja * 2 * Math.PI) * 76}
      {...L}
      strokeWidth={8}
    />
    <circle cx={120} cy={146} r={10} fill={R.marino} />
  </svg>
);

export const Tarjeta: React.FC<{
  nombre: string;
  dato: string;
  children?: React.ReactNode;
}> = ({ nombre, dato, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      background: R.papel,
      border: `${TRAZO}px solid ${R.marino}`,
      borderRadius: 18,
      padding: "18px 32px 18px 18px",
      boxShadow: `8px 8px 0 ${R.marino}`,
      fontFamily: "Inter",
    }}
  >
    {children}
    <div>
      <div
        style={{
          fontWeight: 900,
          fontSize: 56,
          color: R.marino,
          lineHeight: 1,
        }}
      >
        {nombre}
      </div>
      <div
        style={{
          fontFamily: "JetBrains Mono",
          fontWeight: 700,
          fontSize: 28,
          color: R.azul,
          marginTop: 8,
        }}
      >
        {dato}
      </div>
    </div>
  </div>
);

export const Chip: React.FC<{
  texto: string;
  fondo?: string;
  color?: string;
  size?: number;
  check?: boolean;
}> = ({ texto, fondo = R.papel, color = R.marino, size = 40, check }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: fondo,
      color,
      border: `5px solid ${R.marino}`,
      borderRadius: 999,
      padding: "8px 26px",
      fontFamily: "Inter",
      fontWeight: 900,
      fontSize: size,
      boxShadow: `5px 5px 0 ${R.marino}`,
      whiteSpace: "nowrap",
    }}
  >
    {check ? (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle
          cx={20}
          cy={20}
          r={18}
          fill={R.verde}
          stroke={R.marino}
          strokeWidth={4}
        />
        <path
          d="M11 21 l6 6 l12 -13"
          stroke={R.blanco}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : null}
    {texto}
  </div>
);

export const Escalones: React.FC<{ ancho: number }> = ({ ancho }) => (
  <svg width={ancho} height={ancho * 0.8} viewBox="0 0 500 400">
    {[0, 1, 2, 3, 4].map((i) => (
      <rect
        key={i}
        x={i * 100}
        y={320 - i * 70}
        width={500 - i * 100}
        height={80 + i * 70}
        fill={i % 2 ? "#E9DFC3" : "#DCD0AE"}
        {...L}
      />
    ))}
  </svg>
);

export const Corazon: React.FC<{ size: number; tapon?: boolean }> = ({
  size,
  tapon,
}) => (
  <svg width={size} height={size} viewBox="0 0 300 300" overflow="visible">
    <path
      d="M150 270 C 60 210, 20 150, 34 96 C 46 52, 100 34, 150 80 C 200 34, 254 52, 266 96 C 280 150, 240 210, 150 270 Z"
      fill={R.rojo}
      {...L}
    />
    <path
      d="M70 90 C 90 140, 120 170, 150 200"
      stroke={R.rosa}
      strokeWidth={14}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M230 90 C 214 130, 196 150, 176 168"
      stroke={R.rosa}
      strokeWidth={14}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M118 150 C 104 170, 98 190, 100 214"
      stroke={R.rosa}
      strokeWidth={12}
      fill="none"
      strokeLinecap="round"
    />
    {tapon ? (
      <circle
        cx={212}
        cy={130}
        r={13}
        fill={R.grasa}
        stroke={R.marino}
        strokeWidth={4}
      />
    ) : null}
    <ellipse
      cx={92}
      cy={80}
      rx={22}
      ry={12}
      fill="#FF8A93"
      opacity={0.7}
      transform="rotate(-35 92 80)"
    />
  </svg>
);

/** Corte de una arteria (o tubería) horizontal, con grasa en la pared de abajo. */
export const Tubo: React.FC<{
  ancho: number;
  alto: number;
  grasa: number; // 0..1 cuánto tapa
  aplastado?: number; // 0..1
  colorPared?: string;
  colorInterior?: string;
  colorGrasa?: string;
  children?: React.ReactNode;
}> = ({
  ancho,
  alto,
  grasa,
  aplastado = 0,
  colorPared = R.rosaPared,
  colorInterior = "#FCE4EA",
  colorGrasa = R.grasa,
  children,
}) => {
  const pared = 34;
  const hInt = alto - pared * 2;
  const hGrasa = hInt * grasa * (1 - aplastado * 0.78);
  const anchoGrasa = 260 + aplastado * 120;
  const cx = ancho / 2;
  return (
    <svg
      width={ancho}
      height={alto}
      viewBox={`0 0 ${ancho} ${alto}`}
      overflow="visible"
    >
      <rect x={0} y={0} width={ancho} height={alto} fill={colorPared} {...L} />
      <rect
        x={-10}
        y={pared}
        width={ancho + 20}
        height={hInt}
        fill={colorInterior}
      />
      <line x1={0} y1={pared} x2={ancho} y2={pared} {...L} />
      <line x1={0} y1={alto - pared} x2={ancho} y2={alto - pared} {...L} />
      {grasa > 0 ? (
        <path
          d={`M${cx - anchoGrasa / 2} ${alto - pared} C ${cx - anchoGrasa / 2 + 20} ${alto - pared - hGrasa * 1.05}, ${cx + anchoGrasa / 2 - 20} ${alto - pared - hGrasa * 1.05}, ${cx + anchoGrasa / 2} ${alto - pared} Z`}
          fill={colorGrasa}
          {...L}
        />
      ) : null}
      {grasa > 0 && aplastado < 0.5 ? (
        <g>
          <circle
            cx={cx - 40}
            cy={alto - pared - hGrasa * 0.35}
            r={10}
            fill="#FBE3A0"
          />
          <circle
            cx={cx + 50}
            cy={alto - pared - hGrasa * 0.25}
            r={7}
            fill="#FBE3A0"
          />
        </g>
      ) : null}
      {children}
    </svg>
  );
};

export const Globulo: React.FC<{ r?: number }> = ({ r = 22 }) => (
  <g>
    <ellipse
      cx={0}
      cy={0}
      rx={r}
      ry={r * 0.72}
      fill={R.rojo}
      stroke={R.marino}
      strokeWidth={4}
    />
    <ellipse cx={0} cy={0} rx={r * 0.45} ry={r * 0.28} fill="#C42B39" />
  </g>
);

export const Casa: React.FC<{
  size: number;
  tuberia?: boolean;
  puerta?: number;
}> = ({ size, tuberia, puerta = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 400 400" overflow="visible">
    <path
      d="M40 180 L 200 50 L 360 180"
      fill="none"
      {...L}
      strokeWidth={10}
      stroke={R.rojo}
    />
    <path d="M40 180 L 200 50 L 360 180" fill="none" {...L} />
    <rect x={70} y={170} width={260} height={210} fill={R.papel} {...L} />
    <rect x={170} y={260} width={70} height={120} fill={R.azul} {...L} />
    <rect
      x={170}
      y={260}
      width={70 * (1 - puerta * 0.8)}
      height={120}
      fill="#4A78C2"
      {...L}
    />
    <rect x={96} y={210} width={56} height={50} fill={R.celeste} {...L} />
    <rect x={258} y={210} width={56} height={50} fill={R.celeste} {...L} />
    {tuberia ? (
      <path
        d="M310 300 H 380 V 395"
        fill="none"
        stroke={R.gris}
        strokeWidth={22}
      />
    ) : null}
  </svg>
);

export const Martillo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" overflow="visible">
    <rect
      x={88}
      y={70}
      width={24}
      height={120}
      rx={8}
      fill="#B07A4A"
      {...L}
      transform="rotate(-30 100 130)"
    />
    <rect
      x={40}
      y={30}
      width={120}
      height={50}
      rx={8}
      fill={R.gris}
      {...L}
      transform="rotate(-30 100 55)"
    />
  </svg>
);

export const Pared: React.FC<{ size: number; grieta?: number }> = ({
  size,
  grieta = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 220 220" overflow="visible">
    {[0, 1, 2, 3].map((fila) =>
      [0, 1, 2].map((c) => (
        <rect
          key={`${fila}-${c}`}
          x={(fila % 2 ? -35 : 0) + c * 75}
          y={fila * 52}
          width={72}
          height={48}
          fill="#D9825B"
          {...L}
          strokeWidth={5}
        />
      )),
    )}
    {grieta > 0 ? (
      <path
        d="M110 0 L 96 60 L 124 110 L 100 170 L 116 220"
        fill="none"
        {...L}
        strokeWidth={6}
        strokeDasharray={`${300 * grieta} 300`}
      />
    ) : null}
  </svg>
);

export const Tache: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle
      cx={50}
      cy={50}
      r={44}
      fill={R.rojo}
      stroke={R.marino}
      strokeWidth={6}
    />
    <path
      d="M32 32 L 68 68 M68 32 L 32 68"
      stroke={R.blanco}
      strokeWidth={11}
      strokeLinecap="round"
    />
  </svg>
);

export const Visto: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle
      cx={50}
      cy={50}
      r={44}
      fill={R.verde}
      stroke={R.marino}
      strokeWidth={6}
    />
    <path
      d="M28 52 l 15 15 l 30 -32"
      stroke={R.blanco}
      strokeWidth={11}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Brazo: React.FC<{ ancho: number; punto: number }> = ({
  ancho,
  punto,
}) => (
  <svg
    width={ancho}
    height={ancho * 0.42}
    viewBox="0 0 700 300"
    overflow="visible"
  >
    <path
      d="M0 90 L 470 110 Q 520 112 560 100 L 640 80 Q 690 80 690 130 L 690 190 Q 690 230 640 222 L 560 210 Q 520 200 470 200 L 0 220 Z"
      fill={R.piel}
      {...L}
    />
    <path d="M0 80 L 260 90 L 260 230 L 0 230 Z" fill={R.celeste} {...L} />
    <path
      d="M610 100 l 30 -4 M612 130 l 34 0 M610 160 l 32 4"
      {...L}
      strokeWidth={4}
    />
    <circle
      cx={480}
      cy={158}
      r={18 * punto}
      fill={R.rojo}
      stroke={R.marino}
      strokeWidth={4}
    />
    {punto > 0 ? (
      <circle
        cx={480}
        cy={158}
        r={40 * punto}
        fill="none"
        stroke={R.rojo}
        strokeWidth={5}
        strokeDasharray="8 10"
        opacity={0.8}
      />
    ) : null}
  </svg>
);

export const Silueta: React.FC<{
  size: number;
  children?: React.ReactNode;
}> = ({ size, children }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 600 780"
    overflow="visible"
  >
    <circle cx={300} cy={110} r={80} fill={R.papel} {...L} />
    <path
      d="M190 220 Q 300 190 410 220 L 430 560 Q 300 590 170 560 Z"
      fill={R.papel}
      {...L}
    />
    <path
      d="M190 230 L 90 520 L 60 680 L 110 690 L 150 540 L 230 330 Z"
      fill={R.papel}
      {...L}
    />
    <path
      d="M410 230 L 510 520 L 540 680 L 490 690 L 450 540 L 370 330 Z"
      fill={R.papel}
      {...L}
    />
    {children}
  </svg>
);

export const Calendario: React.FC<{ size: number; texto: string }> = ({
  size,
  texto,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect
      x={20}
      y={36}
      width={160}
      height={150}
      rx={12}
      fill={R.papel}
      {...L}
    />
    <rect x={20} y={36} width={160} height={44} rx={10} fill={R.rojo} {...L} />
    <rect x={56} y={18} width={14} height={36} rx={6} fill={R.marino} />
    <rect x={130} y={18} width={14} height={36} rx={6} fill={R.marino} />
    <text
      x={100}
      y={156}
      textAnchor="middle"
      fontFamily="Inter"
      fontWeight={900}
      fontSize={58}
      fill={R.marino}
    >
      {texto}
    </text>
  </svg>
);

export const Pastillas: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <g transform="rotate(-35 100 100)">
      <rect
        x={40}
        y={74}
        width={120}
        height={52}
        rx={26}
        fill={R.papel}
        {...L}
      />
      <path d="M100 74 h34 a26 26 0 0 1 0 52 h-34 Z" fill={R.rojo} {...L} />
    </g>
    <circle cx={150} cy={150} r={24} fill={R.celeste} {...L} />
  </svg>
);

export const Ensalada: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx={70} cy={92} r={26} fill="#6CC070" {...L} strokeWidth={5} />
    <circle cx={104} cy={78} r={28} fill="#8BD47E" {...L} strokeWidth={5} />
    <circle cx={136} cy={96} r={24} fill="#4FA85A" {...L} strokeWidth={5} />
    <circle cx={100} cy={104} r={12} fill={R.rojo} {...L} strokeWidth={4} />
    <path d="M30 110 h140 a70 60 0 0 1 -140 0 Z" fill={R.papel} {...L} />
  </svg>
);

export const Zapato: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path
      d="M30 140 L 30 76 Q 60 70 76 92 L 118 106 Q 172 114 172 140 Z"
      fill={R.azul}
      {...L}
    />
    <rect
      x={26}
      y={138}
      width={150}
      height={22}
      rx={10}
      fill={R.papel}
      {...L}
    />
    <path
      d="M80 100 l -8 14 M96 104 l -8 14 M112 108 l -8 14"
      stroke={R.blanco}
      strokeWidth={5}
      strokeLinecap="round"
    />
  </svg>
);

export const Reloj: React.FC<{ size: number; aguja: number }> = ({
  size,
  aguja,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx={100} cy={100} r={86} fill={R.papel} {...L} />
    <line x1={100} y1={100} x2={100} y2={44} {...L} strokeWidth={8} />
    <line
      x1={100}
      y1={100}
      x2={100 + Math.sin(aguja) * 64}
      y2={100 - Math.cos(aguja) * 64}
      {...L}
      strokeWidth={6}
      stroke={R.rojo}
    />
    <circle cx={100} cy={100} r={8} fill={R.marino} />
  </svg>
);

export const Mensaje: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path
      d="M30 40 h140 a16 16 0 0 1 16 16 v74 a16 16 0 0 1 -16 16 h-84 l -36 30 v-30 h-20 a16 16 0 0 1 -16 -16 v-74 a16 16 0 0 1 16 -16 Z"
      fill={R.verde}
      {...L}
    />
    <circle cx={68} cy={94} r={10} fill={R.blanco} />
    <circle cx={100} cy={94} r={10} fill={R.blanco} />
    <circle cx={132} cy={94} r={10} fill={R.blanco} />
  </svg>
);
