import React from "react";
import { C } from "./estilo";

const Marco: React.FC<{ size: number; fondo?: string; children: React.ReactNode }> = ({
  size,
  fondo = C.blanco,
  children,
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <circle cx={60} cy={60} r={56} fill={fondo} stroke={C.marino} strokeWidth={5} />
    {children}
  </svg>
);

export const Cigarrillo: React.FC<{ size: number; tachado?: boolean }> = ({ size, tachado }) => (
  <Marco size={size}>
    <rect x={22} y={56} width={60} height={14} rx={3} fill={C.blanco} stroke={C.gris} strokeWidth={3} />
    <rect x={82} y={56} width={18} height={14} rx={3} fill="#E9A15A" />
    <circle cx={24} cy={63} r={5} fill={C.rojo} />
    <path d="M22 50 q -6 -10 2 -18 q 8 -8 0 -16" stroke={C.gris} strokeWidth={4} fill="none" strokeLinecap="round" />
    {tachado ? (
      <g>
        <circle cx={60} cy={60} r={46} fill="none" stroke={C.rojo} strokeWidth={9} />
        <line x1={28} y1={28} x2={92} y2={92} stroke={C.rojo} strokeWidth={9} strokeLinecap="round" />
      </g>
    ) : null}
  </Marco>
);

export const Tensiometro: React.FC<{ size: number }> = ({ size }) => (
  <Marco size={size}>
    <circle cx={52} cy={54} r={24} fill={C.blanco} stroke={C.marino} strokeWidth={5} />
    <line x1={52} y1={54} x2={66} y2={42} stroke={C.rojo} strokeWidth={5} strokeLinecap="round" />
    <path d="M52 78 Q 52 96 78 94" stroke={C.marino} strokeWidth={5} fill="none" />
    <ellipse cx={86} cy={90} rx={10} ry={14} fill={C.rojo} />
    <text x={52} y={40} fontSize={11} fontWeight={900} textAnchor="middle" fill={C.marino} fontFamily="Nunito">
      mmHg
    </text>
  </Marco>
);

export const Glucometro: React.FC<{ size: number }> = ({ size }) => (
  <Marco size={size}>
    <rect x={36} y={26} width={48} height={70} rx={12} fill={C.marinoClaro} />
    <rect x={42} y={34} width={36} height={26} rx={5} fill="#CFEFFF" />
    <text x={60} y={53} fontSize={14} fontWeight={900} textAnchor="middle" fill={C.marino} fontFamily="Nunito">
      mg
    </text>
    <circle cx={60} cy={76} r={7} fill={C.blanco} />
    <path d="M60 96 q -8 10 0 16 q 8 -6 0 -16 Z" fill={C.rojo} />
  </Marco>
);

export const Sofa: React.FC<{ size: number }> = ({ size }) => (
  <Marco size={size}>
    <rect x={26} y={50} width={68} height={26} rx={8} fill="#9B6BC9" />
    <rect x={18} y={60} width={16} height={30} rx={6} fill="#7D4FAD" />
    <rect x={86} y={60} width={16} height={30} rx={6} fill="#7D4FAD" />
    <rect x={30} y={70} width={60} height={20} rx={5} fill="#B48BDB" />
    <rect x={26} y={90} width={6} height={10} fill={C.marino} />
    <rect x={88} y={90} width={6} height={10} fill={C.marino} />
    <text x={84} y={42} fontSize={18} fontWeight={900} fill={C.marino} fontFamily="Nunito">
      z
    </text>
    <text x={94} y={30} fontSize={14} fontWeight={900} fill={C.marino} fontFamily="Nunito">
      z
    </text>
  </Marco>
);

export const Pastillas: React.FC<{ size: number }> = ({ size }) => (
  <Marco size={size}>
    <g transform="rotate(-35 60 60)">
      <rect x={30} y={48} width={60} height={26} rx={13} fill={C.blanco} stroke={C.marino} strokeWidth={4} />
      <path d="M60 48 h17 a13 13 0 0 1 0 26 h-17 Z" fill={C.rojo} />
    </g>
    <circle cx={84} cy={86} r={11} fill="#7CC6F2" stroke={C.marino} strokeWidth={3} />
  </Marco>
);

export const Ensalada: React.FC<{ size: number }> = ({ size }) => (
  <Marco size={size}>
    <circle cx={46} cy={54} r={14} fill="#5DBB63" />
    <circle cx={64} cy={46} r={14} fill="#79CF6E" />
    <circle cx={78} cy={58} r={12} fill="#4AA352" />
    <circle cx={58} cy={60} r={7} fill={C.rojo} />
    <circle cx={74} cy={50} r={5} fill={C.rojo} />
    <path d="M24 64 h72 a36 30 0 0 1 -72 0 Z" fill="#F3E2C3" stroke={C.marino} strokeWidth={4} />
  </Marco>
);

export const Zapato: React.FC<{ size: number }> = ({ size }) => (
  <Marco size={size}>
    <path d="M24 82 L 24 50 Q 40 46 50 58 L 74 66 Q 98 70 98 84 Z" fill={C.marinoClaro} stroke={C.marino} strokeWidth={4} strokeLinejoin="round" />
    <rect x={22} y={82} width={78} height={10} rx={5} fill={C.blanco} stroke={C.marino} strokeWidth={4} />
    <path d="M52 62 l -4 8 M60 64 l -4 8 M68 66 l -4 8" stroke={C.blanco} strokeWidth={3} strokeLinecap="round" />
    <path d="M8 60 h10 M4 70 h12" stroke={C.gris} strokeWidth={4} strokeLinecap="round" />
  </Marco>
);

export const Calendario: React.FC<{ size: number; texto?: string; check?: boolean }> = ({
  size,
  texto,
  check = true,
}) => (
  <Marco size={size}>
    <rect x={28} y={32} width={64} height={60} rx={8} fill={C.blanco} stroke={C.marino} strokeWidth={4} />
    <rect x={28} y={32} width={64} height={18} rx={6} fill={C.rojo} />
    <rect x={40} y={24} width={6} height={16} rx={3} fill={C.marino} />
    <rect x={74} y={24} width={6} height={16} rx={3} fill={C.marino} />
    {texto ? (
      <text x={60} y={82} fontSize={22} fontWeight={900} textAnchor="middle" fill={C.marino} fontFamily="Nunito">
        {texto}
      </text>
    ) : check ? (
      <path d="M44 72 l 10 10 l 22 -22" stroke={C.verde} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ) : null}
  </Marco>
);

export const Reloj: React.FC<{ size: number }> = ({ size }) => (
  <Marco size={size}>
    <circle cx={60} cy={60} r={34} fill={C.blanco} stroke={C.marino} strokeWidth={5} />
    <line x1={60} y1={60} x2={60} y2={38} stroke={C.marino} strokeWidth={5} strokeLinecap="round" />
    <line x1={60} y1={60} x2={76} y2={66} stroke={C.rojo} strokeWidth={5} strokeLinecap="round" />
  </Marco>
);

export const Casa: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <path d="M14 58 L 60 18 L 106 58" stroke={C.rojo} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x={26} y={54} width={68} height={56} fill="#FFF4E0" stroke={C.marino} strokeWidth={5} />
    <rect x={50} y={76} width={20} height={34} fill={C.marinoClaro} />
    <rect x={32} y={64} width={14} height={14} fill="#CFEFFF" stroke={C.marino} strokeWidth={3} />
    <rect x={74} y={64} width={14} height={14} fill="#CFEFFF" stroke={C.marino} strokeWidth={3} />
  </svg>
);
