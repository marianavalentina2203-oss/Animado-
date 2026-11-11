import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { C } from "./estilo";
import { ART, Arteria } from "./arteria";
import { Bateria, CapitanStent, Coro, DonPlaca, Globito, Medico, Paciente, Repartidor, Tren } from "./personajes";
import { Calendario, Casa, Cigarrillo, Ensalada, Pastillas, Reloj, Zapato } from "./iconos";
import { Burbuja, CorazonLogo, En, Escena, Rotulo, iv, latido, pop } from "./ui";
import { framePalabra, inicioFrase } from "./tiempos";

// ---------- 6. El mapa iluminado ----------

const RAMAS = [
  "M 430 60 C 420 140, 380 200, 330 260 C 280 320, 250 380, 240 440",
  "M 330 260 C 360 320, 400 360, 470 400",
  "M 430 60 C 470 120, 560 150, 620 210 C 670 260, 690 320, 700 400",
  "M 620 210 C 600 280, 560 330, 520 370",
  "M 240 440 C 230 470, 210 490, 180 500",
];

export const E06Mapa: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e06-mapa";
  const p1 = inicioFrase(ID, 1);
  const contraste = iv(f, [framePalabra(ID, 0, "contraste"), p1], [0, 1], Easing.inOut(Easing.quad));
  const marca = pop(f, framePalabra(ID, 1, "Don Placa") - 6);
  const pulso = 1 + Math.sin(f / 4) * 0.06;
  return (
    <Escena id={ID}>
      <En x={540} y={700}>
        <div style={{ width: 900, height: 640, background: C.marino, borderRadius: 36, padding: 22, boxSizing: "border-box" }}>
          <div style={{ width: "100%", height: "100%", background: "#0E1A3A", borderRadius: 20, position: "relative", overflow: "hidden" }}>
            <svg width={856} height={596} viewBox="0 0 856 596">
              <g transform="translate(0 40)">
                {RAMAS.map((d) => (
                  <path key={d} d={d} stroke="#2B3A66" strokeWidth={26} fill="none" strokeLinecap="round" />
                ))}
                {RAMAS.map((d) => {
                  const ev = evolvePath(contraste, d);
                  return (
                    <path
                      key={`c${d}`}
                      d={d}
                      stroke={C.cian}
                      strokeWidth={20}
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={ev.strokeDasharray}
                      strokeDashoffset={ev.strokeDashoffset}
                      style={{ filter: "drop-shadow(0 0 12px rgba(127,231,255,0.9))" }}
                    />
                  );
                })}
                {/* estrechez visible */}
                <rect x={630} y={222} width={44} height={20} rx={8} fill="#0E1A3A" transform="rotate(50 652 232)" opacity={contraste > 0.6 ? 1 : 0} />
              </g>
              <text x={30} y={50} fill={C.cian} fontSize={30} fontWeight={800} fontFamily="Nunito" opacity={0.8}>
                ● REC
              </text>
            </svg>
            {f >= framePalabra(ID, 1, "Don Placa") - 6 ? (
              <div style={{ position: "absolute", left: 652 - 80, top: 272 - 80, width: 160, height: 160, scale: marca * pulso }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `10px solid ${C.rojo}` }} />
                <div style={{ position: "absolute", left: 80, top: -86 }}>
                  <DonPlaca size={120} cara="sorpresa" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </En>
      <En x={880} y={1160} escala={0.9}>
        <Medico size={170} brazo={150} />
      </En>
      <En x={300} y={1180} escala={pop(f, framePalabra(ID, 0, "contraste"))}>
        <Burbuja texto="Contraste" size={56} />
      </En>
    </Escena>
  );
};

// ---------- Elementos de la arteria compartidos por 7, 8 y 9 ----------

const X_ATASCO = 560;
const S_PLACA = 410;

const PlacaEnPared: React.FC<{ aplastado: number; cara: React.ComponentProps<typeof DonPlaca>["cara"] }> = ({
  aplastado,
  cara,
}) => (
  <div
    style={{
      position: "absolute",
      left: X_ATASCO - S_PLACA / 2,
      top: ART.abajo + 6 - S_PLACA * 0.833,
      width: S_PLACA,
      height: S_PLACA,
      transformOrigin: "50% 83.3%",
      scale: `${1 + aplastado * 0.35} ${1 - aplastado * 0.62}`,
    }}
  >
    <DonPlaca size={S_PLACA} cara={cara} sombrero />
  </div>
);

const GLOBO_ANCHO = 720;

// ---------- 7. ¡Fuuum! ----------

export const E07Globito: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e07-globito";
  const fuum = framePalabra(ID, 1, "fuuum");
  const llega = iv(f, [4, inicioFrase(ID, 1) + 10], [-500, X_ATASCO], Easing.out(Easing.cubic));
  const inflado = iv(f, [fuum, fuum + 14], [0, 1], Easing.out(Easing.back(1.6)));
  const aplastado = iv(f, [fuum + 2, fuum + 16], [0, 1], Easing.out(Easing.cubic));
  const yHueco = ART.arriba + 52;
  const yGlobo = yHueco + (ART.centro - 30 - yHueco) * aplastado;
  const rafaga = pop(f, fuum, 8);
  const abierto = pop(f, inicioFrase(ID, 2) + 20);
  return (
    <Escena id={ID}>
      <Arteria />
      <PlacaEnPared aplastado={aplastado} cara={f < fuum ? "grunon" : f < inicioFrase(ID, 2) + 10 ? "sorpresa" : "aplastado"} />
      <En x={llega} y={yGlobo}>
        <Globito ancho={GLOBO_ANCHO} inflado={inflado} />
      </En>
      <En x={llega - 470} y={yGlobo - 28}>
        <Tren size={170} />
      </En>
      {f >= fuum ? (
        <En x={760} y={360} escala={rafaga} rot={-6} opacidad={iv(f, [fuum + 40, fuum + 55], [1, 0])}>
          <div style={{ fontSize: 130, fontWeight: 900, color: C.rojo, WebkitTextStroke: `6px ${C.marino}`, letterSpacing: 4 }}>¡FUUUM!</div>
        </En>
      ) : null}
      {f >= inicioFrase(ID, 2) + 20 ? (
        <En x={540} y={380} escala={abierto}>
          <Burbuja texto="¡Vía abierta!" size={58} color={C.verde} />
        </En>
      ) : null}
      <Rotulo texto="Balón" desde={fuum + 12} />
    </Escena>
  );
};

// ---------- 8. El Capitán Stent ----------

export const E08Stent: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e08-stent";
  const aparece = framePalabra(ID, 0, "Capitán");
  const abierto = iv(f, [aparece - 4, aparece + 16], [0, 1], Easing.out(Easing.back(1.3)));
  const verStent = iv(f, [aparece - 10, aparece], [0, 1]);
  const desinfla = iv(f, [inicioFrase(ID, 1), inicioFrase(ID, 1) + 30], [1, 0]);
  const p2 = inicioFrase(ID, 2);
  const salida = iv(f, [p2 + 10, p2 + 60], [0, 1], Easing.in(Easing.cubic));
  const xGlobo = X_ATASCO - salida * 1500;
  const yC = ART.centro - 30;
  const brillo = pop(f, aparece);
  return (
    <Escena id={ID}>
      <Arteria />
      <PlacaEnPared aplastado={1} cara="aplastado" />
      <En x={xGlobo} y={yC}>
        <Globito ancho={GLOBO_ANCHO} inflado={desinfla} saluda={f > p2} />
      </En>
      <En x={xGlobo - 470} y={yC - 28}>
        <Tren size={170} />
      </En>
      <En x={X_ATASCO} y={yC} opacidad={verStent}>
        <CapitanStent ancho={GLOBO_ANCHO} abierto={abierto} capa={f / 5} saluda={f > p2 + 10} />
      </En>
      {f >= aparece ? (
        <En x={X_ATASCO} y={yC} escala={brillo * 1.4} opacidad={iv(f, [aparece + 10, aparece + 30], [1, 0])}>
          <svg width={500} height={500} viewBox="0 0 100 100">
            <path d="M50 0 L58 40 L100 50 L58 60 L50 100 L42 60 L0 50 L42 40 Z" fill={C.amarillo} opacity={0.8} />
          </svg>
        </En>
      ) : null}
      {f >= p2 + 10 ? (
        <En x={260} y={380} escala={pop(f, p2 + 10)}>
          <Burbuja texto="¡Chao!" size={56} />
        </En>
      ) : null}
      <Rotulo texto="Stent" desde={aparece + 10} />
    </Escena>
  );
};

// ---------- 9. ¡La autopista vuelve a fluir! ----------

export const E09Fluye: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e09-fluye";
  const p1 = inicioFrase(ID, 1);
  const p2 = inicioFrase(ID, 2);
  const faseA = iv(f, [p1 - 6, p1 + 6], [1, 0]);
  const faseB = Math.min(iv(f, [p1 - 2, p1 + 10], [0, 1]), iv(f, [p2 - 6, p2 + 6], [1, 0]));
  const faseC = iv(f, [p2 - 2, p2 + 10], [0, 1]);
  const yC = ART.centro - 30;
  const carga = iv(f, [p1 + 10, p2 - 10], [0.12, 1], Easing.inOut(Easing.quad));
  const baile = Math.sin(f / 4);
  const caminata = iv(f, [p2, p2 + 150], [0, 1], Easing.linear);
  return (
    <Escena id={ID}>
      <div style={{ position: "absolute", inset: 0, opacity: faseA }}>
        <Arteria avance={f * 18} />
        <PlacaEnPared aplastado={1} cara="triste" />
        <En x={X_ATASCO} y={yC}>
          <CapitanStent ancho={GLOBO_ANCHO} abierto={1} capa={f / 4} saluda />
        </En>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = ((f * 26 + i * 260) % 1560) - 240;
          return (
            <En key={i} x={x} y={yC + (i % 2 ? 40 : -40)}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: -110, top: 60, width: 100, height: 8, background: C.blanco, borderRadius: 4, opacity: 0.8 }} />
                <div style={{ position: "absolute", left: -90, top: 90, width: 70, height: 8, background: C.blanco, borderRadius: 4, opacity: 0.8 }} />
                <Repartidor size={140} />
              </div>
            </En>
          );
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: faseB }}>
        <En x={540} y={400}>
          <Bateria nivel={carga} size={260} />
        </En>
        <En x={540 + baile * 30} y={820} rot={baile * 8} escala={latido(f, 20, 0.7)}>
          <Coro size={560} brazoIzq={150 + baile * 25} brazoDer={150 - baile * 25} />
        </En>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: faseC }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1060, height: 16, background: C.grisClaro }} />
        <En x={880} y={900}>
          <Casa size={300} />
        </En>
        <En x={160 + caminata * 380} y={880}>
          <Paciente size={170} pose="camina" paso={f / 3} />
        </En>
        <En x={40 + caminata * 380} y={900} escala={0.95}>
          <Paciente size={160} pose="camina" paso={f / 3 + 1.5} camisa="#E77FA8" />
        </En>
        <En x={260 + caminata * 380} y={950} escala={0.65}>
          <Paciente size={160} pose="camina" paso={f / 2.5} camisa="#F7C948" />
        </En>
        <En x={300} y={420} escala={pop(f, framePalabra(ID, 2, "hora") - 6)}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Reloj size={130} />
            <Burbuja texto="≈ 1 hora" size={52} />
          </div>
        </En>
        <En x={740} y={600} escala={pop(f, framePalabra(ID, 2, "casa") - 6)}>
          <Burbuja texto="A casa en 1 o 2 días" size={48} color={C.verde} />
        </En>
      </div>
    </Escena>
  );
};

// ---------- 10. Final feliz: un equipo para siempre ----------

export const E10Final: React.FC = () => {
  const f = useCurrentFrame();
  const ID = "e10-final";
  const p1 = inicioFrase(ID, 1);
  const p2 = inicioFrase(ID, 2);
  const p3 = inicioFrase(ID, 3);
  const choque = iv(f, [10, inicioFrase(ID, 1) - 10], [0, 1], Easing.inOut(Easing.cubic));
  const destello = pop(f, inicioFrase(ID, 1) - 12);
  const faseA = iv(f, [p1 - 6, p1 + 6], [1, 0]);
  const faseB = Math.min(iv(f, [p1 - 2, p1 + 10], [0, 1]), iv(f, [p3 - 6, p3 + 4], [1, 0]));
  const faseC = iv(f, [p3 - 2, p3 + 8], [0, 1]);
  const habitos = [
    { icono: <Pastillas size={170} />, texto: "Medicamentos", palabra: "medicamentos" },
    { icono: <Ensalada size={170} />, texto: "Come sano", palabra: "come sano" },
    { icono: <Zapato size={170} />, texto: "Muévete", palabra: "muévete" },
    { icono: <Cigarrillo size={170} tachado />, texto: "No fumes", palabra: "no fumes" },
    { icono: <Calendario size={170} />, texto: "Controles", palabra: "controles" },
  ];
  const ventana = iv(f, [p2, p2 + 14], [0, 1], Easing.out(Easing.back(1.2)));
  const seVa = iv(f, [framePalabra(ID, 2, "mudarse") - 4, framePalabra(ID, 2, "mudarse") + 26], [0, 1], Easing.in(Easing.cubic));
  return (
    <Escena id={ID}>
      <div style={{ position: "absolute", inset: 0, opacity: faseA }}>
        <En x={260 + choque * 130} y={760}>
          <Coro size={420} brazoDer={20 + choque * 120} brazoIzq={30} />
        </En>
        <En x={840 - choque * 215} y={780}>
          <div style={{ scale: "-1 1" }}>
            <Paciente size={230} brazoSaludo={choque > 0.9 ? 0 : f / 3} camisa="#5DADE2" />
          </div>
        </En>
        {f >= inicioFrase(ID, 1) - 12 ? (
          <En x={548} y={620} escala={destello * 1.2} opacidad={iv(f, [inicioFrase(ID, 1) - 2, inicioFrase(ID, 1) + 8], [1, 0])}>
            <svg width={260} height={260} viewBox="0 0 100 100">
              <path d="M50 0 L58 40 L100 50 L58 60 L50 100 L42 60 L0 50 L42 40 Z" fill={C.amarillo} />
            </svg>
          </En>
        ) : null}
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: faseB }}>
        {habitos.map((h, i) => {
          const desde = framePalabra(ID, 1, h.palabra) - 4;
          const p = pop(f, desde);
          const fila = i < 3 ? 0 : 1;
          const x = fila === 0 ? 210 + i * 330 : 375 + (i - 3) * 330;
          return (
            <En key={h.texto} x={x} y={500 + fila * 380} escala={f >= desde ? p : 0}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                {h.icono}
                <div style={{ fontSize: 46, fontWeight: 900, color: C.marino }}>{h.texto}</div>
              </div>
            </En>
          );
        })}
        {f >= p2 ? (
          <En x={540} y={1150} escala={ventana}>
            <div style={{ width: 360, height: 260, background: "#CFEFFF", border: `14px solid ${C.marino}`, borderRadius: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 10, background: C.marino }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 10, background: C.marino }} />
              <div style={{ position: "absolute", left: 60, top: 40 + seVa * 260, rotate: `${seVa * 20}deg` }}>
                <DonPlaca size={220} cara="triste" />
              </div>
            </div>
          </En>
        ) : null}
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: faseC }}>
        <En x={540} y={820} escala={pop(f, p3 - 2) * latido(f, 24, 0.6)}>
          <Coro size={600} modo={f > p3 + 14 ? "guino" : "feliz"} brazoIzq={30} brazoDer={150 + Math.sin(f / 3) * 15} />
        </En>
        <En x={560} y={360} escala={pop(f, p3)}>
          <Burbuja texto="¡Gracias por cuidarme!" size={64} color={C.blanco} fondo={C.rojo} />
        </En>
      </div>
    </Escena>
  );
};

// ---------- 11. Cierre de C-Cardio ----------

export type Contactos = { telefono: string; instagram: string; facebook: string };

export const E11Cierre: React.FC<{ contactos: Contactos }> = ({ contactos }) => {
  const f = useCurrentFrame();
  const ID = "e11-cierre";
  const logo = pop(f, 2, 11);
  const coro = pop(f, 10);
  const lineas = [
    contactos.telefono ? `Teléfono / WhatsApp: ${contactos.telefono}` : "",
    contactos.instagram ? `Instagram: ${contactos.instagram}` : "",
    contactos.facebook ? `Facebook: ${contactos.facebook}` : "",
  ].filter(Boolean);
  return (
    <Escena id={ID} marca={false}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, background: C.marino }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 22, height: 12, background: C.rojo }} />
      <En x={540} y={430} escala={logo}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 150, fontWeight: 900, color: C.marino }}>
          <CorazonLogo size={190} />
          <span>
            C-<span style={{ color: C.rojo }}>Cardio</span>
          </span>
        </div>
      </En>
      <En x={540} y={600} opacidad={logo}>
        <div style={{ fontSize: 56, fontWeight: 800, color: C.marinoClaro }}>Cuidamos tu corazón</div>
      </En>
      <En x={540} y={900} escala={coro * latido(f, 26, 0.5)}>
        <Coro size={380} brazoIzq={30} brazoDer={150 + Math.sin(f / 3) * 18} />
      </En>
      {lineas.map((l, i) => (
        <En key={l} x={540} y={1170 + i * 80} escala={pop(f, 20 + i * 6)}>
          <div style={{ fontSize: 50, fontWeight: 800, color: C.marino, whiteSpace: "nowrap" }}>{l}</div>
        </En>
      ))}
    </Escena>
  );
};
