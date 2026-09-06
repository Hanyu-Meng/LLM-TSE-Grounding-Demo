#!/usr/bin/env python3
"""Render amplitude-normalized waveform traces from released demo audio.

The output is deliberately monochrome and transparent so that the same real
signal traces can be reused in the academic overview diagrams at any size.
"""

from __future__ import annotations

import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "public" / "assets" / "audio" / "clean"
OUTPUT = ROOT / "public" / "assets" / "waveforms"

WIDTH, HEIGHT = 1600, 220
INK = (20, 20, 20, 255)
ZERO = (185, 185, 185, 155)

SOURCES = {
    "mixture": AUDIO / "segmented" / "mixture.wav",
    "enrollment": AUDIO / "segmented" / "enrollment.wav",
    "target": AUDIO / "segmented" / "target.wav",
    "interferer": AUDIO / "segmented" / "interferer.wav",
    "primary": AUDIO / "segmented" / "primary.wav",
    "repaired": AUDIO / "segmented" / "pool-d.wav",
    "evidence": AUDIO / "csg" / "pool-d.wav",
    "qwen-ud": AUDIO / "csg" / "ud.wav",
    "qwen-csg": AUDIO / "csg" / "csg.wav",
    "tfmap": AUDIO / "tfmap" / "pool-d.wav",
}


def read_pcm16(path: Path) -> np.ndarray:
    with wave.open(str(path), "rb") as stream:
        if stream.getsampwidth() != 2:
            raise ValueError(f"Expected PCM16 WAV: {path}")
        channels = stream.getnchannels()
        samples = np.frombuffer(stream.readframes(stream.getnframes()), dtype="<i2").astype(np.float32)
    if channels > 1:
        samples = samples.reshape(-1, channels).mean(axis=1)
    return samples / 32768.0


def envelope(samples: np.ndarray, columns: int) -> tuple[np.ndarray, np.ndarray]:
    edges = np.linspace(0, len(samples), columns + 1, dtype=np.int64)
    minima = np.zeros(columns, dtype=np.float32)
    maxima = np.zeros(columns, dtype=np.float32)
    for index in range(columns):
        chunk = samples[edges[index] : edges[index + 1]]
        if chunk.size:
            minima[index] = float(np.min(chunk))
            maxima[index] = float(np.max(chunk))
    scale = float(np.quantile(np.abs(samples), 0.995)) if samples.size else 1.0
    scale = max(scale, 1e-6)
    return np.clip(minima / scale, -1.0, 1.0), np.clip(maxima / scale, -1.0, 1.0)


def render(source: Path, destination: Path) -> None:
    image = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    centre = HEIGHT // 2
    draw.line((0, centre, WIDTH, centre), fill=ZERO, width=2)

    minima, maxima = envelope(read_pcm16(source), WIDTH)
    amplitude = HEIGHT * 0.44
    for x, (low, high) in enumerate(zip(minima, maxima, strict=True)):
        y_top = centre - int(round(high * amplitude))
        y_bottom = centre - int(round(low * amplitude))
        if y_top == y_bottom:
            y_bottom += 1
        draw.line((x, y_top, x, y_bottom), fill=INK, width=1)

    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, optimize=True)


def main() -> None:
    for name, source in SOURCES.items():
        destination = OUTPUT / f"{name}.png"
        render(source, destination)
        print(f"{source.relative_to(ROOT)} -> {destination.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
