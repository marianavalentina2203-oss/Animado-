"""Genera la narración del reel "Don José y la tubería tapada".

Lee src/reel/guion.json, sintetiza cada plano con Piper (voz masculina es_MX-ald-medium)
y, si se indica un modelo Whisper, transcribe cada toma para comprobar que se entiende:
si la transcripción no coincide con el guion, repite la toma.

Escribe:
  - public/reel/voz.mp3        (toda la narración en una pista)
  - src/reel/tiempos.json      (inicio/fin de cada plano y de cada palabra, para los subtítulos)

Uso:
  pip install piper-tts sherpa-onnx soundfile numpy
  python scripts/generar-voz-reel.py --modelo es_MX-ald-medium.onnx [--whisper carpeta-sherpa-onnx-whisper-small]

Modelos (descarga directa desde GitHub):
  https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-es_MX-ald-medium.tar.bz2
  https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2
"""

import argparse
import difflib
import json
import re
import subprocess
import tempfile
import unicodedata
import wave
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

RAIZ = Path(__file__).resolve().parent.parent
INICIO = 0.25  # silencio al empezar el video
PAUSA = 0.12  # silencio entre planos (ritmo de reel)
FINAL = 1.2  # silencio al terminar

# Cómo debe leer el sintetizador algunas palabras.
PRONUNCIACION = {"C-Cardio": "Ce Cardio"}


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def duracion(ruta):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(ruta)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def normalizar(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = t.replace("ce cardio", "c-cardio").replace("c cardio", "c-cardio").replace("cecardio", "c-cardio")
    return re.sub(r"[^a-z0-9\- ]", " ", t).split()


def parecido(a, b):
    return difflib.SequenceMatcher(None, normalizar(a), normalizar(b)).ratio()


class Transcriptor:
    def __init__(self, carpeta):
        import sherpa_onnx as so

        c = Path(carpeta)
        self.r = so.OfflineRecognizer.from_whisper(
            encoder=str(c / "small-encoder.int8.onnx"),
            decoder=str(c / "small-decoder.int8.onnx"),
            tokens=str(c / "small-tokens.txt"),
            language="es",
            task="transcribe",
            num_threads=4,
        )

    def __call__(self, ruta):
        import soundfile as sf

        x, sr = sf.read(str(ruta), dtype="float32")
        s = self.r.create_stream()
        s.accept_waveform(sr, x)
        self.r.decode_stream(s)
        return s.result.text.strip()


def tiempos_palabras(texto, inicio, fin):
    """Reparte el tiempo del plano entre sus palabras según su largo y las pausas de puntuación."""
    palabras = texto.split()
    pesos = []
    for p in palabras:
        letras = len(re.sub(r"[^\wáéíóúñü]", "", p, flags=re.I))
        pausa = 3.0 if re.search(r"[.?!…:]$", p) else 1.8 if p.endswith(",") else 0.0
        pesos.append((letras + 1.2, pausa))
    total = sum(a + b for a, b in pesos[:-1]) + pesos[-1][0]
    t = inicio
    out = []
    for i, (p, (w, pausa)) in enumerate(zip(palabras, pesos)):
        d = (fin - inicio) * w / total
        out.append({"w": p, "inicio": round(t, 3), "fin": round(t + d, 3)})
        t += d + ((fin - inicio) * pausa / total if i < len(palabras) - 1 else 0)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--modelo", required=True)
    ap.add_argument("--whisper", help="carpeta del modelo sherpa-onnx-whisper-small (opcional)")
    ap.add_argument("--tempo", type=float, default=1.1, help="aceleración sin cambiar el tono")
    ap.add_argument("--tomas", type=int, default=10)
    args = ap.parse_args()

    voz = PiperVoice.load(args.modelo)
    cfg = SynthesisConfig(length_scale=1.0, noise_scale=0.6, noise_w_scale=0.7)
    asr = Transcriptor(args.whisper) if args.whisper else None

    guion = json.loads((RAIZ / "src/reel/guion.json").read_text(encoding="utf-8"))
    salida = RAIZ / "public/reel"
    salida.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        partes, planos, t = [], [], INICIO
        for plano in guion["planos"]:
            texto = plano["texto"]
            leer = texto
            for k, v in PRONUNCIACION.items():
                leer = leer.replace(k, v)
            mejor = None
            for n in range(args.tomas):
                crudo = tmp / f"{plano['id']}-{n}.wav"
                with wave.open(str(crudo), "wb") as w:
                    voz.synthesize_wav(leer, w, syn_config=cfg)
                limpio = tmp / f"{plano['id']}-{n}-ok.wav"
                ffmpeg("-i", str(crudo), "-af",
                       "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,"
                       f"silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,atempo={args.tempo}",
                       "-ar", "16000", "-ac", "1", str(limpio))
                oido = asr(limpio) if asr else texto
                nota = parecido(texto, oido)
                if mejor is None or nota > mejor[1]:
                    mejor = (limpio, nota, oido)
                if nota >= 0.93:
                    break
            archivo, nota, oido = mejor
            d = duracion(archivo)
            print(f"{plano['id']}: {d:.2f}s  parecido={nota:.2f}  oído: {oido}")
            planos.append({
                "id": plano["id"],
                "etiqueta": plano["etiqueta"],
                "texto": texto,
                "inicio": round(t, 3),
                "fin": round(t + d, 3),
                "palabras": tiempos_palabras(texto, t, t + d),
                "transcripcion": oido,
                "parecido": round(nota, 3),
            })
            partes.append(archivo)
            t += d + PAUSA
        total = t - PAUSA + FINAL

        entradas, filtros = [], []
        for j, archivo in enumerate(partes):
            entradas += ["-i", str(archivo)]
            filtros.append(f"[{j}]adelay={int(planos[j]['inicio'] * 1000)}:all=1[a{j}]")
        mezcla = "".join(f"[a{j}]" for j in range(len(partes)))
        filtros.append(
            f"{mezcla}amix=inputs={len(partes)}:normalize=0,apad,atrim=0:{total:.3f},"
            "highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,"
            "loudnorm=I=-14:TP=-1.5[out]"
        )
        ffmpeg(*entradas, "-filter_complex", ";".join(filtros), "-map", "[out]",
               "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-q:a", "2", str(salida / "voz.mp3"))

    (RAIZ / "src/reel/tiempos.json").write_text(
        json.dumps({"duracion": round(total, 3), "planos": planos}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print("Total:", round(total, 1), "s")


if __name__ == "__main__":
    main()
