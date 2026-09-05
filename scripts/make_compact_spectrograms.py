#!/usr/bin/env python3
"""Render compact, high-density spectrogram comparisons for the demo page.

The figures intentionally omit the old global title, trial id, and footer: that
context already appears in the surrounding HTML.  Each PNG is exported at
2,000 px wide and displayed at 560 px or less on the site.
"""

from __future__ import annotations

import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "public" / "assets" / "audio" / "clean"
FIGURES = ROOT / "public" / "assets" / "figures"

WIDTH, HEIGHT = 2000, 1160
BACKGROUND = "#ffffff"
INK = "#253247"
MUTED = "#66758a"
GRID = "#d9e1e8"
BLUE = "#367da6"
ORANGE = "#d96b42"
GREEN = "#738c62"

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def load_pcm16(path: Path, seconds: float = 8.0) -> tuple[np.ndarray, int]:
    with wave.open(str(path), "rb") as stream:
        if stream.getsampwidth() != 2:
            raise ValueError(f"Expected PCM16 WAV: {path}")
        sample_rate = stream.getframerate()
        channels = stream.getnchannels()
        frame_count = min(stream.getnframes(), int(seconds * sample_rate))
        samples = np.frombuffer(stream.readframes(frame_count), dtype="<i2").astype(np.float32)
    if channels > 1:
        samples = samples.reshape(-1, channels).mean(axis=1)
    samples /= 32768.0
    return samples, sample_rate


def spectrogram(path: Path) -> tuple[np.ndarray, float]:
    samples, sample_rate = load_pcm16(path)
    n_fft, hop = 512, 128
    if len(samples) < n_fft:
        samples = np.pad(samples, (0, n_fft - len(samples)))
    frame_count = 1 + (len(samples) - n_fft) // hop
    shape = (frame_count, n_fft)
    strides = (samples.strides[0] * hop, samples.strides[0])
    frames = np.lib.stride_tricks.as_strided(samples, shape=shape, strides=strides)
    spectrum = np.fft.rfft(frames * np.hanning(n_fft), axis=1)
    power = np.abs(spectrum) ** 2
    frequencies = np.fft.rfftfreq(n_fft, d=1.0 / sample_rate)
    power = power[:, frequencies <= 8000.0].T
    db = 10.0 * np.log10(np.maximum(power, 1e-12))
    db -= float(np.max(db))
    return np.clip(db, -70.0, 0.0), len(samples) / sample_rate


def colourise(db: np.ndarray) -> Image.Image:
    values = np.clip((db + 70.0) / 70.0, 0.0, 1.0)
    stops = np.array([0.0, 0.38, 0.68, 0.86, 1.0])
    colours = np.array(
        [
            [19, 35, 52],
            [29, 80, 108],
            [61, 139, 170],
            [218, 106, 66],
            [248, 231, 197],
        ],
        dtype=np.float32,
    )
    rgb = np.empty((*values.shape, 3), dtype=np.float32)
    for channel in range(3):
        rgb[..., channel] = np.interp(values, stops, colours[:, channel])
    return Image.fromarray(np.uint8(np.clip(rgb[::-1], 0, 255)), mode="RGB")


def draw_panel(
    canvas: Image.Image,
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    source: Path,
    title: str,
    subtitle: str,
    accent: str,
    show_y: bool,
    show_x: bool,
) -> None:
    left, top, right, bottom = box
    title_y = top
    plot_top = top + 76
    plot_bottom = bottom - (58 if show_x else 20)
    plot_left = left + (72 if show_y else 24)
    plot_right = right - 10

    draw.text((plot_left, title_y), title, fill=accent, font=font(36, True))
    draw.text((plot_left, title_y + 39), subtitle, fill=MUTED, font=font(27, True))

    db, duration = spectrogram(source)
    heatmap = colourise(db).resize(
        (plot_right - plot_left, plot_bottom - plot_top), Image.Resampling.LANCZOS
    )
    canvas.paste(heatmap, (plot_left, plot_top))

    for fraction in (0.25, 0.5, 0.75):
        x = round(plot_left + fraction * (plot_right - plot_left))
        y = round(plot_top + fraction * (plot_bottom - plot_top))
        draw.line((x, plot_top, x, plot_bottom), fill=GRID, width=1)
        draw.line((plot_left, y, plot_right, y), fill=GRID, width=1)
    draw.rectangle((plot_left, plot_top, plot_right, plot_bottom), outline="#526579", width=3)

    tick_font = font(25)
    for index in range(5):
        fraction = index / 4
        x = round(plot_left + fraction * (plot_right - plot_left))
        draw.line((x, plot_bottom, x, plot_bottom + 9), fill="#526579", width=2)
        if show_x:
            label = f"{duration * fraction:.1f}"
            draw.text((x, plot_bottom + 15), label, fill=MUTED, font=tick_font, anchor="ma")
    if show_x:
        draw.text(
            ((plot_left + plot_right) // 2, plot_bottom + 46),
            "Time (s)",
            fill=INK,
            font=font(28),
            anchor="ma",
        )

    for khz in (0, 2, 4, 6, 8):
        y = round(plot_bottom - (khz / 8) * (plot_bottom - plot_top))
        draw.line((plot_left - 9, y, plot_left, y), fill="#526579", width=2)
        if show_y:
            draw.text((plot_left - 16, y), str(khz), fill=MUTED, font=tick_font, anchor="rm")
    if show_y:
        label_layer = Image.new("RGBA", (plot_bottom - plot_top, 56), (255, 255, 255, 0))
        label_draw = ImageDraw.Draw(label_layer)
        label_draw.text(
            ((plot_bottom - plot_top) // 2, 28),
            "Frequency (kHz)",
            fill=INK,
            font=font(28),
            anchor="mm",
        )
        label_layer = label_layer.rotate(90, expand=True)
        canvas.alpha_composite(label_layer, (left + 2, plot_top))


def draw_colourbar(canvas: Image.Image, draw: ImageDraw.ImageDraw) -> None:
    x0, x1 = WIDTH - 88, WIDTH - 54
    y0, y1 = 160, HEIGHT - 112
    ramp = np.linspace(0, 1, y1 - y0, dtype=np.float32)[:, None]
    ramp_db = ramp * 70.0 - 70.0
    bar = colourise(ramp_db).resize((x1 - x0, y1 - y0), Image.Resampling.BICUBIC)
    canvas.paste(bar, (x0, y0))
    draw.rectangle((x0, y0, x1, y1), outline="#526579", width=2)
    draw.text(((x0 + x1) // 2, y0 - 16), "dB", fill=MUTED, font=font(24, True), anchor="ms")
    for value in (0, -20, -40, -60, -70):
        fraction = abs(value) / 70
        y = round(y0 + fraction * (y1 - y0))
        draw.line((x1, y, x1 + 9, y), fill="#526579", width=2)
        draw.text((x1 + 16, y), str(value), fill=MUTED, font=font(24), anchor="lm")


CASES = {
    "clean-case-segmented.png": [
        (AUDIO / "segmented" / "target.wav", "Target reference", "evaluation only", BLUE),
        (AUDIO / "segmented" / "interferer.wav", "Interferer reference", "evaluation only", MUTED),
        (AUDIO / "segmented" / "primary.wav", "Primary WeSep", "wrong speaker · WER 100%", MUTED),
        (AUDIO / "segmented" / "pool-d.wav", "Pool D · middle view", "target recovered · WER 0%", ORANGE),
    ],
    "clean-case-tfmap.png": [
        (AUDIO / "tfmap" / "target.wav", "Target reference", "evaluation only", BLUE),
        (AUDIO / "tfmap" / "interferer.wav", "Interferer reference", "evaluation only", MUTED),
        (AUDIO / "tfmap" / "primary.wav", "Primary WeSep", "wrong speaker · WER 100%", MUTED),
        (AUDIO / "tfmap" / "pool-d.wav", "Pool D · TF-map view", "target recovered · WER 0%", ORANGE),
    ],
    "clean-case-csg.png": [
        (AUDIO / "csg" / "target.wav", "Target reference", "evaluation only", BLUE),
        (AUDIO / "csg" / "pool-d.wav", "Pool D evidence", "direct WER 0%", ORANGE),
        (AUDIO / "csg" / "ud.wav", "Q-Full UD", "decoder drift · WER 27.3%", MUTED),
        (AUDIO / "csg" / "csg.wav", "Q-Full + fixed CSG", "drift reduced · WER 9.1%", GREEN),
    ],
}


def render(output_name: str, rows: list[tuple[Path, str, str, str]]) -> None:
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(canvas)
    left, top = 24, 30
    right = WIDTH - 124
    column_gap, row_gap = 56, 62
    panel_width = (right - left - column_gap) // 2
    panel_height = (HEIGHT - top - 24 - row_gap) // 2
    for index, (source, title, subtitle, accent) in enumerate(rows):
        row, column = divmod(index, 2)
        x0 = left + column * (panel_width + column_gap)
        y0 = top + row * (panel_height + row_gap)
        draw_panel(
            canvas,
            draw,
            (x0, y0, x0 + panel_width, y0 + panel_height),
            source,
            title,
            subtitle,
            accent,
            show_y=column == 0,
            show_x=row == 1,
        )
    draw_colourbar(canvas, draw)
    output = FIGURES / output_name
    canvas.convert("RGB").save(output, format="PNG", optimize=True, dpi=(216, 216))
    print(f"wrote {output} ({WIDTH}x{HEIGHT})")


def main() -> None:
    for output_name, rows in CASES.items():
        render(output_name, rows)


if __name__ == "__main__":
    main()
