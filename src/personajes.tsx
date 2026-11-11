import React from "react";
import { C } from "./estilo";

const OJO = C.marino;

// ---------- Coro, el corazón ----------

export type ModoCoro = "feliz" | "cansado" | "guino" | "sorpresa";

export const Coro: React.FC<{
  size: number;
  modo?: ModoCoro;
  brazoIzq?: number; // ángulo en grados (0 = abajo, 180 = arriba)
  brazoDer?: number;
  sudor?: number; // 0..1
  sentado?: boolean;
}> = ({ size, modo = "feliz", brazoIzq = 35, brazoDer = 35, sudor = 0, sentado = false }) => {
  const brazo = (x: number, y: number, ang: number, lado: 1 | -1) => {
    const r = (ang * Math.PI) / 180;
    const largo = 62;
    const ex = x + lado * Math.sin(r) * largo;
    const ey = y + Math.cos(r) * largo;
    return (
      <g>
        <path
          d={`M${x} ${y} Q ${(x + ex) / 2 + lado * 10} ${(y + ey) / 2 + 8} ${ex} ${ey}`}
          stroke={C.rojoOscuro}
          strokeWidth={13}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={ex} cy={ey} r={15} fill={C.blanco} stroke={C.rojoOscuro} strokeWidth={5} />
      </g>
    );
  };
  return (
    <svg width={size} height={size * 1.05} viewBox="-60 -20 360 330" overflow="visible">
      {/* piernas */}
      {sentado ? (
        <g stroke={C.rojoOscuro} strokeWidth={13} strokeLinecap="round" fill="none">
          <path d="M95 200 Q 85 235 50 240" />
          <path d="M145 200 Q 155 235 190 240" />
        </g>
      ) : (
        <g stroke={C.rojoOscuro} strokeWidth={13} strokeLinecap="round">
          <line x1={100} y1={195} x2={94} y2={262} />
          <line x1={140} y1={195} x2={146} y2={262} />
        </g>
      )}
      <ellipse cx={sentado ? 42 : 86} cy={sentado ? 244 : 268} rx={24} ry={12} fill={C.marino} />
      <ellipse cx={sentado ? 198 : 154} cy={sentado ? 244 : 268} rx={24} ry={12} fill={C.marino} />
      {brazo(30, 110, brazoIzq, -1)}
      {brazo(210, 110, brazoDer, 1)}
      {/* cuerpo */}
      <path
        d="M120 214 C 50 164, 8 118, 18 76 C 26 40, 60 24, 86 30 C 103 34, 114 46, 120 60 C 126 46, 137 34, 154 30 C 180 24, 214 40, 222 76 C 232 118, 190 164, 120 214 Z"
        fill={C.rojo}
        stroke={C.rojoOscuro}
        strokeWidth={6}
      />
      <ellipse cx={66} cy={70} rx={22} ry={13} fill="#FF8A93" opacity={0.75} transform="rotate(-30 66 70)" />
      {/* cachetes */}
      <ellipse cx={72} cy={134} rx={15} ry={9} fill="#FF8A93" />
      <ellipse cx={168} cy={134} rx={15} ry={9} fill="#FF8A93" />
      {/* ojos */}
      {modo === "guino" ? (
        <>
          <ellipse cx={92} cy={108} rx={13} ry={17} fill={C.blanco} />
          <circle cx={94} cy={111} r={8} fill={OJO} />
          <path d="M134 110 Q 148 98 162 110" stroke={OJO} strokeWidth={7} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={92} cy={108} rx={13} ry={modo === "sorpresa" ? 19 : 17} fill={C.blanco} />
          <ellipse cx={148} cy={108} rx={13} ry={modo === "sorpresa" ? 19 : 17} fill={C.blanco} />
          <circle cx={94} cy={modo === "cansado" ? 114 : 111} r={8} fill={OJO} />
          <circle cx={150} cy={modo === "cansado" ? 114 : 111} r={8} fill={OJO} />
          <circle cx={97} cy={107} r={2.6} fill={C.blanco} />
          <circle cx={153} cy={107} r={2.6} fill={C.blanco} />
          {modo === "cansado" ? (
            <>
              <path d="M78 100 Q 92 106 106 100 L106 90 L78 90 Z" fill={C.rojo} />
              <path d="M134 100 Q 148 106 162 100 L162 90 L134 90 Z" fill={C.rojo} />
              <line x1={78} y1={100} x2={106} y2={100} stroke={C.rojoOscuro} strokeWidth={4} strokeLinecap="round" />
              <line x1={134} y1={100} x2={162} y2={100} stroke={C.rojoOscuro} strokeWidth={4} strokeLinecap="round" />
            </>
          ) : null}
        </>
      )}
      {/* boca */}
      {modo === "cansado" ? (
        <path d="M102 150 Q 120 140 138 150" stroke={OJO} strokeWidth={6} fill="none" strokeLinecap="round" />
      ) : modo === "sorpresa" ? (
        <ellipse cx={120} cy={146} rx={11} ry={14} fill={OJO} />
      ) : (
        <path d="M98 138 Q 120 166 142 138 Z" fill={OJO} stroke={OJO} strokeWidth={4} strokeLinejoin="round" />
      )}
      {/* sudor */}
      {sudor > 0 ? (
        <g opacity={sudor}>
          <path d="M214 48 q 9 16 0 24 q -9 -8 0 -24 Z" fill="#7CC6F2" />
          <path d="M28 40 q 7 12 0 18 q -7 -6 0 -18 Z" fill="#7CC6F2" />
        </g>
      ) : null}
    </svg>
  );
};

// ---------- Repartidor (glóbulo rojo con oxígeno) ----------

export const Repartidor: React.FC<{ size: number; sinCaja?: boolean; boca?: "feliz" | "o" }> = ({
  size,
  sinCaja = false,
  boca = "feliz",
}) => (
  <svg width={size} height={size} viewBox="0 0 160 160" overflow="visible">
    {!sinCaja ? (
      <g>
        <rect x={46} y={6} width={68} height={50} rx={8} fill="#E9B872" stroke="#A97C3C" strokeWidth={4} />
        <line x1={46} y1={22} x2={114} y2={22} stroke="#A97C3C" strokeWidth={3} />
        <text x={80} y={50} fontSize={26} fontWeight={900} textAnchor="middle" fill={C.marino} fontFamily="Nunito">
          O₂
        </text>
      </g>
    ) : null}
    <circle cx={50} cy={140} r={12} fill={C.marino} />
    <circle cx={110} cy={140} r={12} fill={C.marino} />
    <ellipse cx={80} cy={100} rx={62} ry={44} fill={C.rojo} stroke={C.rojoOscuro} strokeWidth={5} />
    <ellipse cx={80} cy={100} rx={36} ry={22} fill="#D02A38" opacity={0.6} />
    <circle cx={64} cy={94} r={8} fill={C.blanco} />
    <circle cx={96} cy={94} r={8} fill={C.blanco} />
    <circle cx={65} cy={96} r={4.5} fill={OJO} />
    <circle cx={97} cy={96} r={4.5} fill={OJO} />
    {boca === "o" ? (
      <ellipse cx={80} cy={116} rx={6} ry={7} fill={OJO} />
    ) : (
      <path d="M68 112 Q 80 124 92 112" stroke={OJO} strokeWidth={4.5} fill="none" strokeLinecap="round" />
    )}
  </svg>
);

// ---------- Don Placa ----------

export type CaraPlaca = "grunon" | "sorpresa" | "triste" | "aplastado";

export const DonPlaca: React.FC<{
  size: number;
  cara?: CaraPlaca;
  maleta?: boolean;
  sombrero?: boolean;
}> = ({ size, cara = "grunon", maleta = false, sombrero = true }) => (
  <svg width={size} height={size} viewBox="0 0 240 240" overflow="visible">
    {maleta ? (
      <g>
        <rect x={180} y={150} width={56} height={44} rx={6} fill="#8B5E3C" stroke="#5C3B22" strokeWidth={4} />
        <path d="M196 150 v-10 h24 v10" stroke="#5C3B22" strokeWidth={5} fill="none" />
        <rect x={180} y={166} width={56} height={6} fill="#E9B872" />
      </g>
    ) : null}
    <path
      d="M30 200 C 10 170, 18 130, 40 116 C 36 86, 64 66, 92 74 C 104 50, 146 48, 158 74 C 186 66, 214 92, 204 122 C 228 140, 226 184, 204 200 Z"
      fill={C.amarillo}
      stroke={C.amarilloOscuro}
      strokeWidth={6}
    />
    <circle cx={70} cy={160} r={9} fill="#E8D9A8" />
    <circle cx={170} cy={176} r={7} fill="#E8D9A8" />
    <circle cx={150} cy={120} r={6} fill="#E8D9A8" />
    {sombrero ? (
      <g>
        <ellipse cx={124} cy={76} rx={58} ry={11} fill="#5C3B22" />
        <path d="M88 76 C 88 40, 160 40, 160 76 Z" fill="#7A4E2D" />
        <rect x={90} y={64} width={68} height={8} fill={C.rojo} />
      </g>
    ) : null}
    {/* cejas y ojos */}
    {cara === "aplastado" ? (
      <>
        <path d="M84 132 l 18 8 l -18 8" stroke={OJO} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M164 132 l -18 8 l 18 8" stroke={OJO} strokeWidth={6} fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx={98} cy={138} rx={12} ry={cara === "sorpresa" ? 17 : 13} fill={C.blanco} />
        <ellipse cx={150} cy={138} rx={12} ry={cara === "sorpresa" ? 17 : 13} fill={C.blanco} />
        <circle cx={100} cy={140} r={6.5} fill={OJO} />
        <circle cx={148} cy={140} r={6.5} fill={OJO} />
        {cara === "grunon" ? (
          <>
            <path d="M82 116 L 112 126" stroke="#5C3B22" strokeWidth={8} strokeLinecap="round" />
            <path d="M166 116 L 136 126" stroke="#5C3B22" strokeWidth={8} strokeLinecap="round" />
          </>
        ) : cara === "triste" ? (
          <>
            <path d="M84 126 L 112 118" stroke="#5C3B22" strokeWidth={7} strokeLinecap="round" />
            <path d="M164 126 L 136 118" stroke="#5C3B22" strokeWidth={7} strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M86 112 Q 98 104 110 112" stroke="#5C3B22" strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M138 112 Q 150 104 162 112" stroke="#5C3B22" strokeWidth={6} fill="none" strokeLinecap="round" />
          </>
        )}
      </>
    )}
    {/* boca */}
    {cara === "grunon" ? (
      <path d="M104 178 Q 124 164 144 178" stroke={OJO} strokeWidth={6} fill="none" strokeLinecap="round" />
    ) : cara === "triste" ? (
      <path d="M106 182 Q 124 170 142 182" stroke={OJO} strokeWidth={6} fill="none" strokeLinecap="round" />
    ) : (
      <ellipse cx={124} cy={176} rx={12} ry={cara === "aplastado" ? 6 : 14} fill={OJO} />
    )}
  </svg>
);

// ---------- Globito (balón de angioplastia) ----------

export const Globito: React.FC<{ ancho: number; inflado: number; saluda?: boolean }> = ({
  ancho,
  inflado,
  saluda = false,
}) => {
  const rx = 50 + 90 * inflado;
  const ry = 16 + 46 * inflado;
  const ojo = 5 + 5 * inflado;
  return (
    <svg width={ancho} height={ancho * 0.5} viewBox="0 0 320 160" overflow="visible">
      <line x1={-400} y1={80} x2={720} y2={80} stroke={C.gris} strokeWidth={5} />
      <rect x={160 - rx} y={80 - ry} width={rx * 2} height={ry * 2} rx={ry} fill="#9ED8F5" stroke="#3E8FC0" strokeWidth={6} />
      <ellipse cx={160 - rx * 0.45} cy={80 - ry * 0.45} rx={rx * 0.3} ry={ry * 0.2} fill={C.blanco} opacity={0.7} />
      <circle cx={146} cy={76} r={ojo} fill={OJO} />
      <circle cx={174} cy={76} r={ojo} fill={OJO} />
      <path
        d={`M${150} ${80 + ry * 0.35} Q 160 ${80 + ry * 0.35 + 6 + 6 * inflado} 170 ${80 + ry * 0.35}`}
        stroke={OJO}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      {saluda ? (
        <g>
          <line x1={160 + rx * 0.5} y1={80 - ry * 0.7} x2={160 + rx * 0.5 + 22} y2={80 - ry - 34} stroke="#3E8FC0" strokeWidth={7} strokeLinecap="round" />
          <circle cx={160 + rx * 0.5 + 22} cy={80 - ry - 38} r={9} fill={C.blanco} stroke="#3E8FC0" strokeWidth={4} />
        </g>
      ) : null}
    </svg>
  );
};

// ---------- Capitán Stent ----------

export const CapitanStent: React.FC<{ ancho: number; abierto: number; capa: number; saluda?: boolean }> = ({
  ancho,
  abierto,
  capa,
  saluda = false,
}) => {
  const rx = 60 + 80 * abierto;
  const ry = 22 + 48 * abierto;
  const x0 = 160 - rx;
  const x1 = 160 + rx;
  const lineas: React.ReactNode[] = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const xs = x0 + ((x1 - x0) * (i + 0.5)) / n;
    lineas.push(
      <path
        key={i}
        d={`M${x} ${80 - ry} L ${xs} 80 L ${x} ${80 + ry}`}
        stroke="#8C99AE"
        strokeWidth={6}
        fill="none"
        strokeLinejoin="round"
      />,
    );
  }
  const ondula = Math.sin(capa) * 14;
  return (
    <svg width={ancho} height={ancho * 0.5} viewBox="0 0 320 160" overflow="visible">
      {/* capa */}
      <path
        d={`M${x0 + 14} ${80 - ry + 6} C ${x0 - 40} ${80 - ry - 10 + ondula}, ${x0 - 90} ${80 + ondula}, ${x0 - 70 + ondula} ${80 + ry + 20} L ${x0 + 30} ${80 + ry - 4} Z`}
        fill={C.rojo}
        stroke={C.rojoOscuro}
        strokeWidth={4}
      />
      <rect x={x0} y={80 - ry} width={rx * 2} height={ry * 2} rx={14} fill="#E8EDF4" opacity={0.3} />
      {lineas}
      <rect x={x0} y={80 - ry} width={rx * 2} height={ry * 2} rx={14} fill="none" stroke="#5E6B82" strokeWidth={6} />
      {/* antifaz y cara */}
      <rect x={128} y={62} width={64} height={22} rx={11} fill={C.marino} />
      <circle cx={146} cy={73} r={6} fill={C.blanco} />
      <circle cx={174} cy={73} r={6} fill={C.blanco} />
      <path d="M146 96 Q 160 108 174 96" stroke={C.marino} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* escudo */}
      <circle cx={160} cy={80 + ry - 2} r={15} fill={C.amarillo} stroke={C.marino} strokeWidth={4} />
      <text x={160} y={80 + ry + 6} textAnchor="middle" fontSize={20} fontWeight={900} fill={C.marino} fontFamily="Nunito">
        S
      </text>
      {saluda ? (
        <g>
          <line x1={x1 - 10} y1={80 - ry + 10} x2={x1 + 16} y2={80 - ry - 34} stroke="#5E6B82" strokeWidth={8} strokeLinecap="round" />
          <circle cx={x1 + 18} cy={80 - ry - 40} r={10} fill={C.blanco} stroke="#5E6B82" strokeWidth={4} />
        </g>
      ) : null}
    </svg>
  );
};

// ---------- Tren Catéter (locomotora) ----------

export const Tren: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120" overflow="visible">
    <rect x={-300} y={64} width={330} height={12} rx={6} fill="#B9C3D3" />
    <rect x={20} y={40} width={120} height={56} rx={22} fill={C.marinoClaro} stroke={C.marino} strokeWidth={5} />
    <path d="M140 44 Q 190 50 190 70 Q 190 92 140 94 Z" fill="#5770B8" stroke={C.marino} strokeWidth={5} />
    <rect x={44} y={16} width={22} height={28} rx={5} fill={C.marino} />
    <circle cx={110} cy={62} r={9} fill={C.blanco} />
    <circle cx={140} cy={62} r={9} fill={C.blanco} />
    <circle cx={112} cy={63} r={5} fill={OJO} />
    <circle cx={142} cy={63} r={5} fill={OJO} />
    <path d="M114 80 Q 127 90 140 80" stroke={C.blanco} strokeWidth={4.5} fill="none" strokeLinecap="round" />
    <circle cx={186} cy={70} r={7} fill="#FFE27A" />
  </svg>
);

// ---------- Equipo de rescate (médico/a) ----------

export const Medico: React.FC<{ size: number; gorro?: string; brazo?: number; pelo?: string }> = ({
  size,
  gorro = "#3FA7D6",
  brazo = 20,
  pelo = "#4A3426",
}) => {
  const r = (brazo * Math.PI) / 180;
  const ex = 128 + Math.sin(r) * 70;
  const ey = 150 - Math.cos(r) * 70 + 70;
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 180 324" overflow="visible">
      <rect x={58} y={250} width={24} height={64} rx={10} fill={C.marino} />
      <rect x={98} y={250} width={24} height={64} rx={10} fill={C.marino} />
      <path d="M40 150 Q 40 120 90 118 Q 140 120 140 150 L 146 262 L 34 262 Z" fill={C.blanco} stroke={C.grisClaro} strokeWidth={5} />
      <path d="M90 120 L 76 170 M90 120 L 104 170" stroke={C.grisClaro} strokeWidth={4} />
      <rect x={100} y={180} width={22} height={6} rx={3} fill={C.rojo} />
      <path d="M50 150 Q 30 200 46 236" stroke={C.blanco} strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d={`M130 150 L ${ex} ${ey}`} stroke={C.blanco} strokeWidth={22} strokeLinecap="round" />
      <circle cx={ex} cy={ey} r={12} fill={C.piel} />
      <circle cx={46} cy={240} r={12} fill={C.piel} />
      <circle cx={90} cy={78} r={42} fill={C.piel} />
      <path d="M48 78 Q 48 30 90 30 Q 132 30 132 78 Q 120 56 90 56 Q 60 56 48 78 Z" fill={pelo} />
      <path d="M50 60 Q 90 14 130 60 L 130 48 Q 90 10 50 48 Z" fill={gorro} />
      <circle cx={76} cy={82} r={5} fill={OJO} />
      <circle cx={104} cy={82} r={5} fill={OJO} />
      <path d="M76 100 Q 90 112 104 100" stroke={OJO} strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={66} cy={96} r={6} fill="#F4A3A3" opacity={0.6} />
      <circle cx={114} cy={96} r={6} fill="#F4A3A3" opacity={0.6} />
    </svg>
  );
};

// ---------- Paciente ----------

export const Paciente: React.FC<{
  size: number;
  pose?: "pie" | "pecho" | "camina";
  paso?: number; // fase de la caminata
  brazoSaludo?: number;
  camisa?: string;
}> = ({ size, pose = "pie", paso = 0, brazoSaludo, camisa = "#5DADE2" }) => {
  const piernaA = pose === "camina" ? Math.sin(paso) * 22 : 0;
  const brazoDer =
    brazoSaludo !== undefined ? (
      <path d={`M128 140 L ${150 + Math.sin(brazoSaludo) * 10} 76`} stroke={camisa} strokeWidth={20} strokeLinecap="round" />
    ) : pose === "pecho" ? (
      <path d="M128 140 Q 120 170 96 160" stroke={camisa} strokeWidth={20} strokeLinecap="round" fill="none" />
    ) : (
      <path d={`M128 140 L ${136 - piernaA * 0.6} 214`} stroke={camisa} strokeWidth={20} strokeLinecap="round" />
    );
  const manoDer =
    brazoSaludo !== undefined ? (
      <circle cx={150 + Math.sin(brazoSaludo) * 10} cy={70} r={12} fill={C.piel} />
    ) : pose === "pecho" ? (
      <circle cx={96} cy={158} r={12} fill={C.piel} />
    ) : (
      <circle cx={136 - piernaA * 0.6} cy={218} r={11} fill={C.piel} />
    );
  return (
    <svg width={size} height={size * 1.8} viewBox="0 0 180 324" overflow="visible">
      <g transform={`rotate(${piernaA} 76 236)`}>
        <rect x={64} y={230} width={24} height={78} rx={10} fill="#3A4A6B" />
        <ellipse cx={80} cy={310} rx={20} ry={9} fill="#2A2A2A" />
      </g>
      <g transform={`rotate(${-piernaA} 104 236)`}>
        <rect x={92} y={230} width={24} height={78} rx={10} fill="#3A4A6B" />
        <ellipse cx={108} cy={310} rx={20} ry={9} fill="#2A2A2A" />
      </g>
      <path d="M50 140 Q 50 116 90 114 Q 130 116 130 140 L 128 240 L 52 240 Z" fill={camisa} />
      <path d={`M52 140 L ${44 + piernaA * 0.6} 214`} stroke={camisa} strokeWidth={20} strokeLinecap="round" />
      <circle cx={44 + piernaA * 0.6} cy={218} r={11} fill={C.piel} />
      {brazoDer}
      {manoDer}
      <circle cx={90} cy={74} r={40} fill={C.piel} />
      <path d="M50 70 Q 52 30 90 32 Q 128 30 130 70 Q 112 50 90 52 Q 68 50 50 70 Z" fill="#2F2A26" />
      <circle cx={76} cy={78} r={5} fill={OJO} />
      <circle cx={104} cy={78} r={5} fill={OJO} />
      {pose === "pecho" ? (
        <path d="M78 102 Q 90 94 102 102" stroke={OJO} strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M76 96 Q 90 108 104 96" stroke={OJO} strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
};

// ---------- Batería ----------

export const Bateria: React.FC<{ nivel: number; size: number }> = ({ nivel, size }) => {
  const color = nivel < 0.3 ? C.rojo : nivel < 0.6 ? C.amarillo : C.verde;
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100">
      <rect x={6} y={10} width={170} height={80} rx={16} fill={C.blanco} stroke={C.marino} strokeWidth={8} />
      <rect x={178} y={34} width={16} height={32} rx={5} fill={C.marino} />
      <rect x={18} y={22} width={Math.max(4, 146 * nivel)} height={56} rx={9} fill={color} />
    </svg>
  );
};
