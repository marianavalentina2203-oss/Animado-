"""Genera la narración del video con Piper (TTS neural local).

Lee src/guion.json, sintetiza cada frase por separado y escribe:
  - public/voz/<escena>.mp3  (una pista por escena)
  - src/tiempos.json         (duración de cada escena e inicio/fin de cada frase,
                              usados para los subtítulos)

Uso:
  pip install piper-tts
  python scripts/generar-voz.py --modelo ruta/a/es-mls_10246-low.onnx

Si se graba una voz humana, basta con reemplazar los mp3 de public/voz/
y ajustar los tiempos en src/tiempos.json.
"""

import argparse
import json
import subprocess
import tempfile
import wave
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

RAIZ = Path(__file__).resolve().parent.parent
PAUSA_INICIO = 0.35  # segundos de silencio antes de la primera frase
PAUSA_FRASE = 0.40  # silencio entre frases
PAUSA_FINAL = 0.70  # silencio al terminar la escena


def sintetizar(voz, texto, destino, cfg):
    with wave.open(str(destino), "wb") as w:
        voz.synthesize_wav(texto, w, syn_config=cfg)


def mejor_toma(voz, texto, base, cfg, tomas=8, objetivo=2.7):
    """El modelo a veces mete pausas largas dentro de una frase.
    Se sintetizan varias tomas y se elige la de ritmo (palabras/s) más natural."""
    palabras = len(texto.split())
    mejor, error_min = None, None
    for n in range(tomas):
        ruta = Path(f"{base}-toma{n}.wav")
        sintetizar(voz, texto, ruta, cfg)
        ritmo = palabras / max(duracion_voz(ruta), 0.1)
        # Las frases muy cortas o exclamaciones se dicen algo más lento.
        meta = objetivo if palabras > 5 else objetivo * 0.8
        error = abs(ritmo - meta)
        if error_min is None or error < error_min:
            mejor, error_min = ruta, error
    return mejor


def duracion_voz(ruta):
    """Duración sin el silencio inicial y final."""
    with tempfile.NamedTemporaryFile(suffix=".wav") as f:
        ffmpeg("-i", str(ruta), "-af",
               "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
               "silenceremove=start_periods=1:start_threshold=-45dB,areverse", f.name)
        return duracion(f.name)


def duracion(ruta):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(ruta)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--modelo", required=True)
    ap.add_argument("--acento", default="es-419", help="voz de espeak para la fonética")
    ap.add_argument("--ritmo", type=float, default=1.12, help=">1 habla más lento")
    args = ap.parse_args()

    voz = PiperVoice.load(args.modelo)
    voz.config.espeak_voice = args.acento
    cfg = SynthesisConfig(length_scale=args.ritmo, noise_w_scale=0.3, noise_scale=0.6)

    guion = json.loads((RAIZ / "src/guion.json").read_text(encoding="utf-8"))
    salida = RAIZ / "public/voz"
    salida.mkdir(parents=True, exist_ok=True)
    tiempos = {}

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        for escena in guion["escenas"]:
            partes, frases, t = [], [], PAUSA_INICIO
            for i, frase in enumerate(escena["frases"]):
                texto = frase if isinstance(frase, str) else frase["texto"]
                quien = "narrador" if isinstance(frase, str) else frase.get("voz", "narrador")
                crudo = mejor_toma(voz, texto, tmp / f"{escena['id']}-{i}", cfg)
                limpio = tmp / f"{escena['id']}-{i}.wav"
                filtro = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
                if quien == "coro":
                    # Voz de personaje: más aguda y alegre, mismo ritmo.
                    filtro += ",asetrate=16000*1.28,aresample=16000,atempo=0.9"
                ffmpeg("-i", str(crudo), "-af", filtro, "-ar", "44100", "-ac", "1", str(limpio))
                d = duracion(limpio)
                frases.append({"texto": texto, "voz": quien, "inicio": round(t, 3), "fin": round(t + d, 3)})
                partes.append((limpio, d))
                t += d + PAUSA_FRASE
            total = t - PAUSA_FRASE + PAUSA_FINAL

            # Une las frases con sus silencios en una sola pista por escena.
            entradas, filtros = [], []
            for j, (archivo, _) in enumerate(partes):
                entradas += ["-i", str(archivo)]
                filtros.append(f"[{j}]adelay={int(frases[j]['inicio'] * 1000)}:all=1[a{j}]")
            mezcla = "".join(f"[a{j}]" for j in range(len(partes)))
            filtros.append(f"{mezcla}amix=inputs={len(partes)}:normalize=0,apad,atrim=0:{total:.3f},loudnorm=I=-16:TP=-1.5[out]")
            ffmpeg(*entradas, "-filter_complex", ";".join(filtros), "-map", "[out]",
                   "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-q:a", "3",
                   str(salida / f"{escena['id']}.mp3"))
            tiempos[escena["id"]] = {"duracion": round(total, 3), "frases": frases}
            print(f"{escena['id']}: {total:.1f} s")

    (RAIZ / "src/tiempos.json").write_text(json.dumps(tiempos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Total:", round(sum(e["duracion"] for e in tiempos.values()), 1), "s")


if __name__ == "__main__":
    main()
