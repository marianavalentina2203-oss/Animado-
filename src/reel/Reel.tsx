import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { evolvePath } from "@remotion/paths";
import {
  Escenario,
  Etiqueta,
  Fondo,
  Insignia,
  Pos,
  Progreso,
  R,
  REEL,
  Subtitulos,
  TRAZO,
  brote,
  desdePlano,
  enPalabra,
  largoPlano,
  tramo,
} from "./base";
import {
  Brazo,
  Busto,
  Calendario,
  Casa,
  Chip,
  Corazon,
  Cronometro,
  Cuerpo,
  Ensalada,
  Escalones,
  Globulo,
  Martillo,
  Mensaje,
  Pared,
  Pastillas,
  Reloj,
  Silueta,
  Tache,
  Tarjeta,
  Tubo,
  Visto,
  Zapato,
} from "./dibujos";

const JOSE = { canas: true, bigote: true, camisa: "#F2A65A" } as const;

const Signo: React.FC<{ texto: string; size?: number; color?: string }> = ({
  texto,
  size = 110,
  color = R.marino,
}) => (
  <div
    style={{
      fontFamily: "Inter",
      fontWeight: 900,
      fontSize: size,
      color,
      lineHeight: 1,
    }}
  >
    {texto}
  </div>
);

// ---------- 1-2. Gancho ----------

const P01: React.FC = () => {
  const f = useCurrentFrame();
  const miedo = enPalabra("p01-miedo", "miedo");
  return (
    <Escenario>
      <Pos x={540} y={850}>
        <Busto
          size={470}
          expresion={f >= miedo - 4 ? "preocupado" : "tranquilo"}
          mano="papel"
          fase={f / 6}
          camisa={R.celeste}
        />
      </Pos>
      <Pos x={300} y={600} s={brote(f, miedo - 4)} r={-12}>
        <Signo texto="?" />
      </Pos>
      <Pos x={790} y={560} s={brote(f, miedo)} r={10}>
        <Signo texto="?" size={140} color={R.rojo} />
      </Pos>
      <Pos
        x={385}
        y={700}
        s={brote(f, miedo + 2)}
        o={tramo(f, [miedo, miedo + 8], [0, 1])}
      >
        <svg width={40} height={56} viewBox="0 0 40 56">
          <path
            d="M20 4 C 30 22, 36 32, 36 38 a16 16 0 0 1 -32 0 C 4 32, 10 22, 20 4 Z"
            fill={R.celeste}
            stroke={R.marino}
            strokeWidth={4}
          />
        </svg>
      </Pos>
    </Escenario>
  );
};

const P02: React.FC = () => {
  const f = useCurrentFrame();
  const minuto = enPalabra("p02-minuto", "minuto");
  return (
    <Escenario>
      <Pos x={540} y={800} r={Math.sin(f / 3) * 2}>
        <Cronometro
          size={430}
          aguja={tramo(
            f,
            [0, largoPlano("p02-minuto")],
            [0, 0.9],
            Easing.linear,
          )}
        />
      </Pos>
      <Pos x={760} y={1040} s={brote(f, minuto - 3)} r={-4}>
        <Chip texto="1 minuto" fondo={R.amarillo} size={52} />
      </Pos>
    </Escenario>
  );
};

// ---------- 3-5. El caso de Don José ----------

const P03: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Escenario>
      <Pos x={540} y={760}>
        <Busto size={440} {...JOSE} expresion="feliz" />
      </Pos>
      <Pos x={540} y={1080} s={brote(f, 6)} r={-3}>
        <Tarjeta nombre="Don José" dato="62 AÑOS" />
      </Pos>
    </Escenario>
  );
};

const P04: React.FC = () => {
  const f = useCurrentFrame();
  const presion = enPalabra("p04-escaleras", "presión");
  const sube = tramo(f, [0, presion], [0, 1], Easing.out(Easing.quad));
  const dolor = f >= presion - 4;
  return (
    <Escenario>
      <Pos x={650} y={960}>
        <Escalones ancho={520} />
      </Pos>
      {/* sube pisando los escalones: del primero (x 440) al tercero (x 650) */}
      <Pos x={440 + sube * 210} y={896 - sube * 146} r={dolor ? 6 : 0}>
        <Cuerpo
          size={210}
          {...JOSE}
          manoPecho={dolor}
          expresion={dolor ? "dolor" : "feliz"}
          paso={dolor ? 0 : f / 3}
        />
      </Pos>
      {dolor ? (
        <Pos x={800} y={660} s={brote(f, presion - 4)}>
          <svg
            width={200}
            height={120}
            viewBox="0 0 200 120"
            style={{ scale: 1 + Math.sin(f / 2) * 0.05 }}
          >
            <path
              d="M10 60 l 30 -30 l 30 60 l 30 -60 l 30 60 l 30 -60 l 30 30"
              stroke={R.rojo}
              strokeWidth={12}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Pos>
      ) : null}
    </Escenario>
  );
};

const P05: React.FC = () => {
  const f = useCurrentFrame();
  const arteria = enPalabra("p05-arteria", "arteria");
  const grasa = enPalabra("p05-arteria", "grasa");
  const lupa = brote(f, arteria - 4);
  return (
    <Escenario>
      <Pos x={300} y={820} s={1 + Math.max(0, Math.sin(f / 4)) * 0.03}>
        <Corazon size={380} tapon />
      </Pos>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
        opacity={lupa}
      >
        <path
          d="M402 760 L 610 690"
          stroke={R.marino}
          strokeWidth={TRAZO}
          strokeDasharray="14 12"
        />
      </svg>
      <Pos x={760} y={720} s={lupa}>
        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `${TRAZO + 4}px solid ${R.marino}`,
            overflow: "hidden",
            background: "#FCE4EA",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: -30, top: 70 }}>
            <Tubo
              ancho={460}
              alto={260}
              grasa={tramo(f, [arteria, grasa], [0.25, 0.72])}
            />
          </div>
        </div>
      </Pos>
      <Pos x={780} y={1010} s={brote(f, grasa - 3)} r={4}>
        <Chip texto="grasa" fondo={R.grasa} size={50} />
      </Pos>
    </Escenario>
  );
};

// ---------- 6-8. La comparación con la tubería ----------

const P06: React.FC = () => {
  const f = useCurrentFrame();
  const tapa = enPalabra("p06-tuberia", "tapa");
  return (
    <Escenario>
      <Pos x={250} y={640}>
        <Casa size={330} tuberia />
      </Pos>
      <Pos x={620} y={930}>
        <Tubo
          ancho={640}
          alto={230}
          grasa={tramo(f, [tapa - 6, tapa + 10], [0.2, 0.82])}
          colorPared="#9AA3B2"
          colorInterior="#DDEFFC"
          colorGrasa="#9C6B3F"
        >
          {[0, 1, 2, 3].map((i) => {
            const x = 60 + i * 50 + Math.sin(f / 4 + i) * 6;
            return (
              <circle
                key={i}
                cx={x}
                cy={115 + Math.cos(f / 5 + i) * 16}
                r={16}
                fill="#5DADE2"
                stroke={R.marino}
                strokeWidth={4}
              />
            );
          })}
        </Tubo>
      </Pos>
      <Pos x={830} y={760} s={brote(f, tapa)}>
        <Tache size={110} />
      </Pos>
    </Escenario>
  );
};

const P07: React.FC = () => {
  const f = useCurrentFrame();
  const plomero = enPalabra("p07-plomero", "plomerito");
  const golpe = Math.max(0, Math.sin(f / 3)) * 30;
  return (
    <Escenario>
      <Pos x={280} y={780}>
        <Pared size={280} grieta={tramo(f, [4, 20], [0, 1])} />
      </Pos>
      <Pos x={350} y={660} r={-golpe}>
        <Martillo size={180} />
      </Pos>
      <Pos x={280} y={1000} s={brote(f, 6)}>
        <Tache size={120} />
      </Pos>
      <Pos x={790} y={790} s={brote(f, plomero - 8)}>
        <Busto
          size={340}
          gorra={R.azul}
          camisa={R.azul}
          mano="llave"
          fase={f / 4}
          expresion="feliz"
        />
      </Pos>
      <Pos x={790} y={1030} s={brote(f, plomero)}>
        <Visto size={120} />
      </Pos>
    </Escenario>
  );
};

const P08: React.FC = () => {
  const f = useCurrentFrame();
  const angio = enPalabra("p08-titulo", "angioplastia");
  return (
    <Escenario>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const p = brote(f, angio);
        return (
          <Pos
            key={i}
            x={540 + Math.cos(a) * 280 * p}
            y={760 + Math.sin(a) * 280 * p}
            r={(a * 180) / Math.PI + 90}
            o={p}
          >
            <div
              style={{
                width: 12,
                height: 50,
                background: R.amarillo,
                borderRadius: 6,
                border: `4px solid ${R.marino}`,
              }}
            />
          </Pos>
        );
      })}
      <Pos x={540} y={760} s={1 + Math.max(0, Math.sin(f / 4)) * 0.04}>
        <Corazon size={340} />
      </Pos>
      <Pos x={540} y={1060} s={brote(f, angio - 2, 10)} r={-4}>
        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 900,
            fontSize: 92,
            color: R.marino,
            background: R.amarillo,
            padding: "6px 30px",
            boxShadow: `9px 9px 0 ${R.marino}`,
            letterSpacing: -2,
          }}
        >
          ANGIOPLASTIA
        </div>
      </Pos>
    </Escenario>
  );
};

// ---------- 9-12. Cómo se hace ----------

const P09: React.FC = () => {
  const f = useCurrentFrame();
  const muneca = enPalabra("p09-muneca", "muñeca");
  const anestesia = enPalabra("p09-muneca", "anestesia");
  return (
    <Escenario>
      <Pos x={540} y={720}>
        <Brazo ancho={880} punto={brote(f, muneca - 3)} />
      </Pos>
      <Pos x={540} y={980} s={brote(f, 4)}>
        <Chip texto="Sin abrir el pecho" check size={50} />
      </Pos>
      <Pos x={540} y={1090} s={brote(f, anestesia - 3)}>
        <Chip texto="Anestesia local" check size={50} />
      </Pos>
    </Escenario>
  );
};

const RUTA_CATETER = "M515 680 L 492 560 L 446 420 L 400 300 Q 370 262 330 296";

const P10: React.FC = () => {
  const f = useCurrentFrame();
  const cateter = enPalabra("p10-cateter", "catéter");
  const avance = tramo(
    f,
    [8, largoPlano("p10-cateter") - 10],
    [0, 1],
    Easing.inOut(Easing.quad),
  );
  const ev = evolvePath(avance, RUTA_CATETER);
  return (
    <Escenario>
      <Pos x={540} y={820}>
        <Silueta size={470}>
          <path
            d="M300 236 C 270 214, 262 196, 266 182 C 270 168, 288 164, 300 178 C 312 164, 330 168, 334 182 C 338 196, 330 214, 300 236 Z"
            fill={R.rojo}
            stroke={R.marino}
            strokeWidth={5}
            transform="translate(30 60)"
          />
          <path
            d={RUTA_CATETER}
            stroke={R.azul}
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={ev.strokeDasharray}
            strokeDashoffset={ev.strokeDashoffset}
          />
        </Silueta>
      </Pos>
      <Pos x={860} y={980} s={brote(f, cateter - 3)} r={-4}>
        <Chip texto="catéter" fondo={R.celeste} size={50} />
      </Pos>
    </Escenario>
  );
};

const ANCHO_T = 880;
const ALTO_T = 360;

const Balon: React.FC<{ inflado: number }> = ({ inflado }) => {
  const w = 130 + 300 * inflado;
  const h = 34 + 186 * inflado;
  const cy = 75 + (157 - 75) * inflado;
  return (
    <g>
      <line
        x1={-40}
        y1={cy}
        x2={ANCHO_T + 40}
        y2={cy}
        stroke={R.marino}
        strokeWidth={5}
      />
      <rect
        x={ANCHO_T / 2 - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        fill={R.celeste}
        stroke={R.marino}
        strokeWidth={TRAZO}
      />
      <ellipse
        cx={ANCHO_T / 2 - w * 0.25}
        cy={cy - h * 0.22}
        rx={w * 0.14}
        ry={h * 0.12}
        fill={R.blanco}
        opacity={0.7}
      />
    </g>
  );
};

const P11: React.FC = () => {
  const f = useCurrentFrame();
  const infla = enPalabra("p11-balon", "infla");
  const aplasta = enPalabra("p11-balon", "aplasta");
  const entra = tramo(f, [0, infla - 4], [-500, 0], Easing.out(Easing.cubic));
  const inflado = tramo(
    f,
    [infla, aplasta + 6],
    [0, 1],
    Easing.out(Easing.back(1.4)),
  );
  return (
    <Escenario>
      <Pos x={540} y={800}>
        <Tubo
          ancho={ANCHO_T}
          alto={ALTO_T}
          grasa={0.72}
          aplastado={tramo(f, [infla + 4, aplasta + 10], [0, 1])}
        >
          <g transform={`translate(${entra} 0)`}>
            <Balon inflado={inflado} />
          </g>
        </Tubo>
      </Pos>
      <Pos x={300} y={540} s={brote(f, infla)} r={-6}>
        <Chip texto="globito" fondo={R.celeste} size={50} />
      </Pos>
    </Escenario>
  );
};

const Malla: React.FC<{ abierto: number }> = ({ abierto }) => {
  const w = 460;
  const h = 70 + 170 * abierto;
  const x0 = ANCHO_T / 2 - w / 2;
  const cy = 157;
  const n = 10;
  return (
    <g>
      <rect
        x={x0}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={16}
        fill="#E3E8EF"
        opacity={0.35}
      />
      {Array.from({ length: n + 1 }).map((_, i) => {
        const x = x0 + (w * i) / n;
        const xm = x0 + (w * (i + 0.5)) / n;
        return (
          <path
            key={i}
            d={`M${x} ${cy - h / 2} L ${xm} ${cy} L ${x} ${cy + h / 2}`}
            stroke="#6B778C"
            strokeWidth={7}
            fill="none"
            strokeLinejoin="round"
          />
        );
      })}
      <rect
        x={x0}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={16}
        fill="none"
        stroke={R.marino}
        strokeWidth={TRAZO}
      />
    </g>
  );
};

const Flujo: React.FC<{
  f: number;
  desde: number;
  y: number;
  ancho: number;
  n?: number;
}> = ({ f, desde, y, ancho, n = 6 }) => (
  <g>
    {f >= desde
      ? Array.from({ length: n }).map((_, i) => {
          const x = (((f - desde) * 16 + (i * ancho) / n) % (ancho + 120)) - 60;
          return (
            <g key={i} transform={`translate(${x} ${y + (i % 2 ? 34 : -34)})`}>
              <Globulo />
            </g>
          );
        })
      : null}
  </g>
);

const P12: React.FC = () => {
  const f = useCurrentFrame();
  const stent = enPalabra("p12-stent", "stent");
  const abierta = enPalabra("p12-stent", "abierta");
  const malla = tramo(
    f,
    [stent - 6, stent + 10],
    [0, 1],
    Easing.out(Easing.back(1.3)),
  );
  const desinfla = tramo(f, [stent + 20, abierta - 4], [1, 0]);
  const sale = tramo(
    f,
    [abierta - 4, abierta + 14],
    [0, 900],
    Easing.in(Easing.cubic),
  );
  return (
    <Escenario>
      <Pos x={540} y={800}>
        <Tubo ancho={ANCHO_T} alto={ALTO_T} grasa={0.72} aplastado={1}>
          <g opacity={tramo(f, [stent - 8, stent], [0, 1])}>
            <Malla abierto={malla} />
          </g>
          <g transform={`translate(${-sale} 0)`}>
            <Balon inflado={desinfla} />
          </g>
          <Flujo f={f} desde={abierta} y={157} ancho={ANCHO_T} />
        </Tubo>
      </Pos>
      <Pos x={760} y={540} s={brote(f, stent - 2)} r={5}>
        <Chip texto="stent" fondo={R.blanco} size={56} />
      </Pos>
    </Escenario>
  );
};

// ---------- 13-15. Después ----------

const P13: React.FC = () => {
  const f = useCurrentFrame();
  const hora = enPalabra("p13-hora", "hora");
  return (
    <Escenario>
      <Pos x={270} y={720}>
        <Reloj size={280} aguja={f / 6} />
      </Pos>
      <Pos x={270} y={930} s={brote(f, hora - 3)}>
        <Chip texto="≈ 1 hora" fondo={R.amarillo} size={52} />
      </Pos>
      <Pos x={760} y={820} s={0.62}>
        <Tubo ancho={ANCHO_T} alto={ALTO_T} grasa={0.72} aplastado={1}>
          <Malla abierto={1} />
          <Flujo f={f} desde={0} y={157} ancho={ANCHO_T} n={7} />
        </Tubo>
      </Pos>
    </Escenario>
  );
};

const P14: React.FC = () => {
  const f = useCurrentFrame();
  const siguiente = enPalabra("p14-casa", "siguiente");
  const camina = tramo(
    f,
    [4, largoPlano("p14-casa") - 22],
    [0, 1],
    Easing.inOut(Easing.quad),
  );
  const llego = camina > 0.98;
  return (
    <Escenario>
      <Pos x={760} y={820}>
        <Casa
          size={420}
          puerta={tramo(
            f,
            [largoPlano("p14-casa") - 30, largoPlano("p14-casa") - 18],
            [0, 1],
          )}
        />
      </Pos>
      <Pos x={170 + camina * 380} y={880}>
        <Cuerpo
          size={170}
          {...JOSE}
          paso={llego ? 0 : f / 3}
          saluda={llego ? f / 3 : undefined}
          expresion="feliz"
        />
      </Pos>
      <Pos x={250} y={600} s={brote(f, siguiente - 3)} r={-6}>
        <Calendario size={190} texto="+1" />
      </Pos>
    </Escenario>
  );
};

const P15: React.FC = () => {
  const f = useCurrentFrame();
  const habitos = [
    { el: <Pastillas size={220} />, texto: "Medicinas", palabra: "medicinas" },
    { el: <Ensalada size={220} />, texto: "Come sano", palabra: "sano" },
    { el: <Zapato size={220} />, texto: "Camina", palabra: "camina" },
  ];
  return (
    <Escenario>
      {habitos.map((h, i) => {
        const d = enPalabra("p15-habitos", h.palabra) - 4;
        const p = f >= d ? brote(f, d) : 0;
        return (
          <React.Fragment key={h.texto}>
            <Pos x={210 + i * 330} y={760} s={p} r={Math.sin(f / 5 + i) * 3}>
              <div
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: "50%",
                  background: R.papel,
                  border: `${TRAZO}px solid ${R.marino}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `7px 7px 0 ${R.marino}`,
                }}
              >
                {h.el}
              </div>
            </Pos>
            <Pos x={210 + i * 330} y={960} s={p}>
              <Chip texto={h.texto} size={40} />
            </Pos>
          </React.Fragment>
        );
      })}
    </Escenario>
  );
};

// ---------- 16. Cierre ----------

const P16: React.FC<{ facebook: string }> = ({ facebook }) => {
  const f = useCurrentFrame();
  const escribe = enPalabra("p16-cierre", "Escríbenos");
  const somos = enPalabra("p16-cierre", "Somos");
  return (
    <Escenario>
      <Pos x={540} y={740} s={brote(f, somos - 6, 11) * 2}>
        <Insignia />
      </Pos>
      <Pos x={540} y={960} s={brote(f, escribe - 3)}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Mensaje size={120} />
          {facebook ? (
            <Chip texto={`Facebook · ${facebook}`} size={46} />
          ) : (
            <Chip texto="Escríbenos" size={46} />
          )}
        </div>
      </Pos>
      <Pos x={540} y={560} s={brote(f, 2)}>
        <Signo texto="¿Dudas?" size={96} />
      </Pos>
    </Escenario>
  );
};

// ---------- Composición ----------

const PLANOS: Record<string, React.FC> = {
  "p01-miedo": P01,
  "p02-minuto": P02,
  "p03-jose": P03,
  "p04-escaleras": P04,
  "p05-arteria": P05,
  "p06-tuberia": P06,
  "p07-plomero": P07,
  "p08-titulo": P08,
  "p09-muneca": P09,
  "p10-cateter": P10,
  "p11-balon": P11,
  "p12-stent": P12,
  "p13-hora": P13,
  "p14-casa": P14,
  "p15-habitos": P15,
};

/** Agrupa planos seguidos con la misma etiqueta para que la etiqueta solo salte al cambiar. */
const TRAMOS_ETIQUETA = REEL.planos.reduce<
  { texto: string; desde: number; hasta: number }[]
>((acc, p) => {
  const desde = desdePlano(p.id);
  const hasta = desde + largoPlano(p.id);
  const ultimo = acc[acc.length - 1];
  if (ultimo && ultimo.texto === p.etiqueta) ultimo.hasta = hasta;
  else acc.push({ texto: p.etiqueta, desde, hasta });
  return acc;
}, []);

export type PropsReel = { facebook: string };

export const ReelAngioplastia: React.FC<PropsReel> = ({ facebook }) => (
  <AbsoluteFill style={{ fontFamily: "Inter" }}>
    <Fondo />
    {REEL.planos.map((p) => {
      const Comp = PLANOS[p.id];
      return (
        <Sequence
          key={p.id}
          name={p.id}
          from={desdePlano(p.id)}
          durationInFrames={largoPlano(p.id)}
        >
          {Comp ? <Comp /> : <P16 facebook={facebook} />}
          <Audio src={staticFile("reel/pop.mp3")} volume={0.35} />
        </Sequence>
      );
    })}
    {TRAMOS_ETIQUETA.map((t) => (
      <Sequence
        key={`${t.texto}-${t.desde}`}
        from={t.desde}
        durationInFrames={t.hasta - t.desde}
        name={`Etiqueta ${t.texto}`}
      >
        <Etiqueta texto={t.texto} desde={0} />
      </Sequence>
    ))}
    <Sequence durationInFrames={desdePlano("p16-cierre")} name="Insignia">
      <div style={{ position: "absolute", left: 80, top: 150 }}>
        <Insignia escala={0.9} />
      </div>
    </Sequence>
    <Subtitulos />
    <Progreso />
    <Audio src={staticFile("reel/voz.mp3")} />
  </AbsoluteFill>
);
