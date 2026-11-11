import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import { C } from "./estilo";
import { ART, Arteria } from "./arteria";
import { Bateria, Coro, DonPlaca, Medico, Paciente, Repartidor, Tren } from "./personajes";
import { Cigarrillo, Glucometro, Sofa, Tensiometro } from "./iconos";
import { Burbuja, En, Escena, Rotulo, iv, latido, pop } from "./ui";
import { framePalabra, inicioFrase } from "./tiempos";

const formatoMiles = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ---------- 1. Coro, el corazón trabajador ----------

export const E01Coro: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e01-coro";
  const entrada = pop(f, 0, 10);
  const contador = iv(f, [framePalabra(ID, 1, "late"), framePalabra(ID, 1, "veces") + 10], [0, 100000], Easing.out(Easing.cubic));
  const verContador = pop(f, framePalabra(ID, 1, "late") - 4);
  const saludo = f < inicioFrase(ID, 1) ? 150 + Math.sin(f / 4) * 20 : 30 + Math.sin(f / 3) * 12;
  return (
    <Escena id={ID}>
      {/* aros de latido */}
      {[0, 1, 2].map((i) => {
        const p = ((f + i * 8) % 24) / 24;
        return (
          <En key={i} x={540} y={720} escala={0.8 + p * 0.7} opacidad={(1 - p) * 0.25}>
            <div style={{ width: 640, height: 640, borderRadius: "50%", border: `14px solid ${C.rojo}` }} />
          </En>
        );
      })}
      <En x={540} y={720} escala={entrada * latido(f)}>
        <Coro size={620} brazoDer={saludo} brazoIzq={f < inicioFrase(ID, 1) ? 30 : 30 + Math.sin(f / 3 + 1) * 12} />
      </En>
      {f >= framePalabra(ID, 1, "late") - 4 ? (
        <En x={540} y={1180} escala={verContador}>
          <div style={{ textAlign: "center", color: C.marino }}>
            <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {formatoMiles(contador)}
            </div>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.rojo }}>latidos al día</div>
          </div>
        </En>
      ) : null}
    </Escena>
  );
};

// ---------- 2. La autopista de la comida ----------

const CAMINO = "M -120 520 C 220 380, 420 820, 600 700 S 920 380, 1220 640";
const CAMINO2 = "M -120 1080 C 200 1180, 380 880, 620 980 S 900 1220, 1220 1020";

export const E02Autopista: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e02-autopista";
  const zoom = iv(f, [inicioFrase(ID, 1) - 6, inicioFrase(ID, 1) + 18], [0, 1], Easing.in(Easing.cubic));
  const hambre = pop(f, framePalabra(ID, 0, "comer") - 6);
  const largo = getLength(CAMINO);
  const largo2 = getLength(CAMINO2);
  const repartidores = [0, 1, 2, 3, 4];
  return (
    <Escena id={ID}>
      {/* superficie del corazón */}
      <div
        style={{
          position: "absolute",
          inset: "200px 0 560px 0",
          background: "radial-gradient(circle at 30% 30%, #F26A75, #DC3442)",
          borderRadius: 60,
          margin: "0 40px",
          opacity: zoom,
          scale: 0.8 + zoom * 0.2,
          overflow: "hidden",
        }}
      >
        <svg width={1000} height={1160} viewBox="40 200 1000 1160">
          {[CAMINO, CAMINO2].map((d) => (
            <g key={d}>
              <path d={d} stroke="#C2475F" strokeWidth={170} fill="none" strokeLinecap="round" />
              <path d={d} stroke={C.rosa} strokeWidth={140} fill="none" strokeLinecap="round" />
              <path d={d} stroke={C.blanco} strokeWidth={8} strokeDasharray="40 36" fill="none" opacity={0.8} />
            </g>
          ))}
        </svg>
      </div>
      {zoom > 0.6
        ? repartidores.map((i) => {
            const enCamino2 = i % 2 === 1;
            const L = enCamino2 ? largo2 : largo;
            const d = (((f * 7 + (i * L) / 3) % L) + L) % L;
            const pt = getPointAtLength(enCamino2 ? CAMINO2 : CAMINO, d) ?? { x: 0, y: 0 };
            return (
              <En key={i} x={pt.x} y={pt.y - 40} opacidad={zoom} escala={0.9}>
                <Repartidor size={130} />
              </En>
            );
          })
        : null}
      {/* Coro antes del zoom */}
      <En x={540} y={720} escala={(1 + zoom * 4) * latido(f, 26, 0.6)} opacidad={1 - zoom}>
        <Coro size={540} brazoIzq={140} brazoDer={20} />
      </En>
      {f >= framePalabra(ID, 0, "comer") - 6 && zoom < 1 ? (
        <En x={760} y={380} escala={hambre} opacidad={1 - zoom}>
          <Burbuja texto="¿Y mi comida?" size={50} />
        </En>
      ) : null}
      <Rotulo texto="Arterias coronarias" desde={framePalabra(ID, 1, "arterias")} />
    </Escena>
  );
};

// ---------- 3. Llega Don Placa ----------

export const E03Placa: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e03-placa";
  const p1 = inicioFrase(ID, 1);
  const p2 = inicioFrase(ID, 2);
  const anio = Math.floor(iv(f, [0, framePalabra(ID, 0, "Don Placa")], [2005, 2025], Easing.linear));
  const llegada = iv(f, [framePalabra(ID, 0, "vecino"), framePalabra(ID, 0, "Don Placa")], [1300, 600], Easing.out(Easing.cubic));
  const caminar = f < framePalabra(ID, 0, "Don Placa") ? Math.sin(f / 3) * 6 : 0;
  const crecer = iv(f, [p1, p2 + 10], [0.55, 1.75], Easing.inOut(Easing.cubic));
  const S = 300 * crecer;
  const cola = iv(f, [p2, p2 + 40], [-400, 0], Easing.out(Easing.cubic));
  const iconos = [
    { el: <Cigarrillo size={150} />, palabra: "cigarrillo" },
    { el: <Tensiometro size={150} />, palabra: "tensión" },
    { el: <Glucometro size={150} />, palabra: "diabetes" },
    { el: <Sofa size={150} />, palabra: "sedentarismo" },
  ];
  return (
    <Escena id={ID}>
      <Arteria avance={0} />
      {/* calendario */}
      <En x={890} y={330} escala={pop(f, 4)} opacidad={iv(f, [p1 - 10, p1], [1, 0])}>
        <div style={{ background: C.blanco, border: `6px solid ${C.marino}`, borderRadius: 24, overflow: "hidden", textAlign: "center", width: 220 }}>
          <div style={{ background: C.rojo, color: C.blanco, fontWeight: 900, fontSize: 30, padding: 6 }}>AÑO</div>
          <div style={{ fontWeight: 900, fontSize: 70, color: C.marino, padding: "4px 0" }}>{anio}</div>
        </div>
      </En>
      {/* iconos de factores de riesgo */}
      {iconos.map((ic, i) => {
        const desde = framePalabra(ID, 1, ic.palabra) - 4;
        const aparece = pop(f, desde);
        const viaje = iv(f, [desde + 24, desde + 44], [0, 1], Easing.in(Easing.cubic));
        if (f < desde) return null;
        const x0 = 180 + i * 240;
        return (
          <En key={i} x={x0 + (600 - x0) * viaje} y={330 + (760 - 330) * viaje} escala={aparece * (1 - viaje * 0.7)} opacidad={1 - viaje}>
            {ic.el}
          </En>
        );
      })}
      {/* cola de repartidores */}
      {f >= p2 - 2
        ? [0, 1, 2].map((i) => (
            <En key={i} x={cola + 90 + i * 150} y={ART.arriba + 90 + (i % 2) * 8} rot={Math.sin(f / 2 + i) * 4}>
              <Repartidor size={130} boca="o" />
            </En>
          ))
        : null}
      {f >= p2 + 20
        ? [0, 1].map((i) => (
            <En key={i} x={150 + i * 260} y={ART.arriba - 120} escala={pop(f, p2 + 20 + i * 8)}>
              <Burbuja texto="¡Piii!" size={46} color={C.rojo} />
            </En>
          ))
        : null}
      {/* Don Placa */}
      <En x={llegada} y={ART.abajo + 4 - S * 0.333} rot={caminar}>
        <DonPlaca size={S} maleta={f < p1} cara="grunon" />
      </En>
      <Rotulo texto="Placa = grasa + colesterol + calcio" desde={framePalabra(ID, 0, "grasa")} />
    </Escena>
  );
};

// ---------- 4. Coro pide ayuda ----------

const Escalera: React.FC = () => (
  <svg width={420} height={360} viewBox="0 0 420 360">
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={i * 84} y={300 - i * 60} width={420 - i * 84} height={60} fill={i % 2 ? "#E3E9F3" : "#D3DCEA"} />
    ))}
  </svg>
);

export const E04Ayuda: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e04-ayuda";
  const p1 = inicioFrase(ID, 1);
  const p2 = inicioFrase(ID, 2);
  const bateria = iv(f, [0, p1], [0.45, 0.12]);
  const parpadeo = f > p1 - 20 ? (Math.floor(f / 8) % 2 === 0 ? 1 : 0.35) : 1;
  const verPersona = pop(f, p1);
  const ayuda = pop(f, p2);
  const xCoro = iv(f, [p1, p1 + 18], [540, 300]);
  return (
    <Escena id={ID}>
      <En x={xCoro} y={760} escala={xCoro < 540 ? 0.8 : 1}>
        <Coro size={520} modo="cansado" sentado brazoIzq={10} brazoDer={f >= p2 ? 165 + Math.sin(f / 3) * 12 : 10} sudor={iv(f, [8, 30], [0, 1])} />
      </En>
      <En x={xCoro} y={380} opacidad={parpadeo}>
        <Bateria nivel={bateria} size={220} />
      </En>
      {f >= p1 ? (
        <>
          <En x={810} y={1010} escala={verPersona}>
            <Escalera />
          </En>
          <En x={800} y={760} escala={verPersona}>
            <Paciente size={210} pose="pecho" camisa="#F39C4A" />
          </En>
          <En x={720} y={560} escala={verPersona} opacidad={0.9}>
            <svg width={120} height={120} viewBox="0 0 120 120">
              <path d="M20 60 l 20 -20 l 20 40 l 20 -40 l 20 20" stroke={C.rojo} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </En>
        </>
      ) : null}
      {f >= p2 ? (
        <En x={300} y={1130} escala={ayuda} rot={Math.sin(f / 4) * 4}>
          <Burbuja texto="¡Ayuda!" size={70} color={C.blanco} fondo={C.rojo} />
        </En>
      ) : null}
    </Escena>
  );
};

// ---------- 5. ¡Llega el equipo de rescate! ----------

const Monitor: React.FC<{ ancho: number; children?: React.ReactNode }> = ({ ancho, children }) => (
  <div style={{ width: ancho, height: ancho * 0.66, background: C.marino, borderRadius: 30, padding: 20, boxSizing: "border-box" }}>
    <div style={{ width: "100%", height: "100%", background: "#0E1A3A", borderRadius: 16, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

const CUERPO_RUTA = "M 250 1120 L 330 960 L 400 800 L 450 680 Q 500 640 560 650";

export const E05Rescate: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e05-rescate";
  const p2 = inicioFrase(ID, 2);
  const p3 = inicioFrase(ID, 3);
  const faseA = iv(f, [p2 - 8, p2 + 4], [1, 0]);
  const faseB = Math.min(iv(f, [p2 - 4, p2 + 8], [0, 1]), iv(f, [p3 - 8, p3 + 4], [1, 0]));
  const faseC = iv(f, [p3 - 4, p3 + 8], [0, 1]);
  const entraMed = iv(f, [0, 16], [0, 1], Easing.out(Easing.back(1.4)));
  const sinPecho = pop(f, framePalabra(ID, 1, "abrir"));
  const puerta = iv(f, [framePalabra(ID, 2, "puerta"), framePalabra(ID, 2, "puerta") + 18], [0, 1]);
  const ingle = pop(f, framePalabra(ID, 2, "ingle") - 4);
  const L = getLength(CUERPO_RUTA);
  const avance = iv(f, [p3 + 6, p3 + 120], [0, 1], Easing.inOut(Easing.quad));
  const pt = getPointAtLength(CUERPO_RUTA, L * avance) ?? { x: 0, y: 0 };
  const tg = getTangentAtLength(CUERPO_RUTA, Math.min(L * avance, L - 1)) ?? { x: 1, y: 0 };
  const angulo = (Math.atan2(tg.y, tg.x) * 180) / Math.PI;
  const sirena = Math.floor(f / 6) % 2 === 0;
  return (
    <Escena id={ID}>
      {/* Fase A: el equipo llega */}
      <div style={{ position: "absolute", inset: 0, opacity: faseA }}>
        <En x={540} y={560}>
          <Monitor ancho={560}>
            <svg width={520} height={330} viewBox="0 0 520 330">
              <path d="M0 180 h140 l30 -70 l40 140 l30 -100 l20 30 h260" stroke={C.cian} strokeWidth={8} fill="none" strokeLinejoin="round" />
            </svg>
          </Monitor>
        </En>
        <En x={540} y={320}>
          <div style={{ width: 70, height: 46, borderRadius: "40px 40px 6px 6px", background: sirena ? C.rojo : "#3E8FC0", boxShadow: `0 0 50px 20px ${sirena ? "rgba(230,57,70,0.5)" : "rgba(62,143,192,0.5)"}` }} />
        </En>
        <En x={-200 + 420 * entraMed} y={930}>
          <Medico size={230} brazo={150 + Math.sin(f / 4) * 15} />
        </En>
        <En x={1280 - 420 * entraMed} y={930}>
          <Medico size={230} gorro="#2BB673" pelo="#C98B4B" brazo={20} />
        </En>
        {f >= framePalabra(ID, 1, "abrir") ? (
          <En x={540} y={1180} escala={sinPecho}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.verde, color: C.blanco, fontWeight: 900, fontSize: 64, padding: "14px 40px", borderRadius: 999 }}>
              <svg width={60} height={60} viewBox="0 0 60 60">
                <circle cx={30} cy={30} r={28} fill={C.blanco} />
                <path d="M16 31 l 10 10 l 18 -20" stroke={C.verde} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sin abrir el pecho
            </div>
          </En>
        ) : null}
      </div>
      {/* Fase B: paciente despierto y la puertita */}
      <div style={{ position: "absolute", inset: 0, opacity: faseB }}>
        <En x={430} y={930}>
          <div style={{ width: 760, height: 60, background: "#B8C6DB", borderRadius: 20 }} />
        </En>
        <En x={450} y={940}>
          <div style={{ width: 720, height: 30, background: C.marinoClaro, borderRadius: 10, marginTop: 70 }} />
        </En>
        <En x={420} y={810} rot={-90}>
          <Paciente size={200} brazoSaludo={f / 3} camisa="#9BD3F0" />
        </En>
        {/* lupa sobre la muñeca */}
        <En x={790} y={520}>
          <div style={{ width: 360, height: 360, borderRadius: "50%", border: `12px solid ${C.marino}`, background: C.piel, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 120, background: C.pielOscura, opacity: 0.35 }} />
            <div style={{ position: "absolute", left: 140, top: 130, width: 80, height: 100, background: "#3A2416", borderRadius: 8 }} />
            <div style={{ position: "absolute", left: 140, top: 130, width: 80, height: 100, background: "#B07A4A", border: "5px solid #6E4426", borderRadius: 8, boxSizing: "border-box", transformOrigin: "left center", scale: `${1 - puerta * 0.85} 1` }} />
          </div>
        </En>
        <En x={790} y={300} escala={pop(f, framePalabra(ID, 2, "muñeca") - 4)}>
          <Burbuja texto="muñeca" size={46} />
        </En>
        {f >= framePalabra(ID, 2, "ingle") - 4 ? (
          <En x={790} y={760} escala={ingle} rot={-4}>
            <Burbuja texto="o ingle" size={46} color={C.rojo} />
          </En>
        ) : null}
        <En x={540} y={1180} escala={pop(f, framePalabra(ID, 2, "anestesia") - 4)}>
          <Burbuja texto="Anestesia local" size={56} color={C.marino} />
        </En>
      </div>
      {/* Fase C: el Tren Catéter viaja hasta el corazón */}
      <div style={{ position: "absolute", inset: 0, opacity: faseC }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <g fill="#E6ECF5" stroke="#C3CEDF" strokeWidth={8}>
            <circle cx={540} cy={430} r={100} />
            <path d="M400 560 Q 540 520 680 560 L 700 1000 Q 540 1040 380 1000 Z" />
            <path d="M400 570 L 300 960 L 240 1140 L 290 1160 L 360 980 L 440 700 Z" />
            <path d="M680 570 L 780 960 L 840 1140 L 790 1160 L 720 980 L 640 700 Z" />
          </g>
          <path d={CUERPO_RUTA} stroke={C.rojo} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.35} />
          <path d={CUERPO_RUTA} stroke={C.rojo} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={`${L * avance} ${L}`} />
        </svg>
        <En x={580} y={650} escala={latido(f, 22, 0.8)}>
          <Coro size={170} brazoIzq={150 + Math.sin(f / 3) * 15} brazoDer={150 - Math.sin(f / 3) * 15} />
        </En>
        <En x={pt.x} y={pt.y} rot={angulo}>
          <Tren size={150} />
        </En>
      </div>
      <Rotulo texto="Catéter" desde={framePalabra(ID, 3, "Tren")} />
    </Escena>
  );
};
