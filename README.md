# Animado — videos sobre la angioplastia (C-Cardio)

Dos videos verticales (1080×1920) hechos con [Remotion](https://www.remotion.dev):

| Composición | Historia | Duración |
| --- | --- | --- |
| `ReelAngioplastia` | "Don José y la tubería tapada": reel para Instagram, voz masculina, subtítulos palabra por palabra | 59 s |
| `Angioplastia` | "Coro y la autopista atascada": versión larga con personajes | 2 min 19 s |

## Reel "Don José y la tubería tapada"

```bash
npx remotion render ReelAngioplastia out/reel-angioplastia.mp4
```

- Guion por planos en `src/reel/guion.json`; código en `src/reel/`.
- Voz: Piper `es_MX-ald-medium` (masculina, acento latino), acelerada ×1.1.
  Se genera con `scripts/generar-voz-reel.py`, que transcribe cada toma con Whisper
  y la repite si no se entiende (ver instrucciones al inicio del script).
- Estilo: fondo crema punteado, ilustración plana con contorno azul marino, etiqueta de
  sección, subtítulo karaoke con la palabra actual resaltada en amarillo y barra de
  cuenta regresiva.

---

# Versión larga — "Coro y la autopista atascada"

Video animado vertical (1080×1920, 9:16) que explica qué es una angioplastia, hecho con
[Remotion](https://www.remotion.dev). Basado en el guion "Guion animado: ¿Qué es una angioplastia?".

- 11 escenas (10 del guion + cierre de C-Cardio), unos 2 min 19 s.
- Narración en español generada con Piper (TTS neural local).
- Subtítulos siempre visibles, sincronizados frase por frase con la voz.
- Rótulos con las palabras clave: arterias coronarias, placa, catéter, balón, stent.

## Uso

```bash
npm install
npm run dev                                                   # vista previa en Remotion Studio
npx remotion render Angioplastia out/angioplastia.mp4         # exportar el MP4
```

## Estructura

| Archivo | Qué contiene |
| --- | --- |
| `src/guion.json` | El texto de la narración, frase por frase |
| `src/tiempos.json` | Duración de cada escena e inicio/fin de cada frase (generado) |
| `public/voz/*.mp3` | La voz de cada escena (generada) |
| `src/personajes.tsx` | Coro, los Repartidores, Don Placa, Globito, Capitán Stent, Tren Catéter, equipo médico y paciente |
| `src/escenas-a.tsx`, `src/escenas-b.tsx` | Las animaciones de cada escena |
| `src/Root.tsx` | La composición y los contactos del cierre |

## Cambiar los contactos del cierre

Edita `contactos` en `src/Root.tsx` (teléfono, Instagram, Facebook). Las líneas vacías no se muestran.

## Regenerar o reemplazar la voz

La voz se genera con `scripts/generar-voz.py`:

```bash
pip install piper-tts
# Modelo de voz (CC BY 4.0): https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-es-mls_10246-low.tar.gz
python scripts/generar-voz.py --modelo ruta/a/es-mls_10246-low.onnx
```

Si se cambia el texto en `src/guion.json`, vuelve a ejecutar el script: actualiza los audios y los
tiempos, y el video se ajusta solo.

Para usar una voz humana: graba una pista por escena, reemplaza los archivos de `public/voz/`
y ajusta `inicio`/`fin` de cada frase en `src/tiempos.json` para que los subtítulos coincidan.

## Pendiente antes de publicar

Según las notas del guion, el equipo médico debe confirmar: vía de acceso (muñeca/ingle),
duración del procedimiento, días de hospitalización, mención de sedación, aviso de emergencias
en la escena 4 y aprobación final del texto.

## Créditos

- Voz: modelo Piper `es-mls_10246-low`, entrenado con Multilingual LibriSpeech (CC BY 4.0).
- Fuente: Nunito (SIL Open Font License), en `public/fonts/`.
- Remotion es gratis para equipos de hasta 3 personas; las empresas más grandes necesitan licencia.
