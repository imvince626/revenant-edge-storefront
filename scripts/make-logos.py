#!/usr/bin/env python3
"""
make-logos.py — Generate transparent logo variants from the opaque source asset.

Source: public/logo-black.png (white wordmark on solid black background)
Output:
  public/logo-mark-white.png  — white wordmark on transparent bg (hero/dark state)
  public/logo-mark-ink.png    — #0A0A0A wordmark on transparent bg (solid/light state)

Method:
  - Convert source to RGBA
  - Compute per-pixel luminance → use as alpha channel
  - Force RGB to white (255,255,255) or ink (10,10,10)
  - Autocrop to the alpha bounding box (same crop box for both)
  - Verify corner alpha = 0 (transparent), wordmark center is opaque
"""

import sys
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow not found. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

# Resolve paths relative to project root (one level up from scripts/)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
SRC = PROJECT_ROOT / "public" / "logo-black.png"
OUT_WHITE = PROJECT_ROOT / "public" / "logo-mark-white.png"
OUT_INK   = PROJECT_ROOT / "public" / "logo-mark-ink.png"

INK_COLOR = (10, 10, 10)  # #0A0A0A

def compute_luminance_mask(img_rgba):
    """
    Given an RGBA image, compute per-pixel luminance from RGB.
    Black background (0,0,0) → luminance 0 → alpha 0 (fully transparent).
    White wordmark (255,255,255) → luminance 255 → alpha 255 (fully opaque).
    Intermediate anti-alias grays → proportional alpha.
    Returns a single-channel 'L' image to use as alpha.
    """
    # Convert to plain RGB (discard any existing alpha — we're rebuilding alpha from luminance)
    rgb = img_rgba.convert("RGB")
    # PIL's convert("L") applies ITU-R 601 weights: 0.299R + 0.587G + 0.114B
    # This is exactly what we want: black bg → 0, white wordmark → 255
    lum = rgb.convert("L")
    return lum


def autocrop_box(alpha_channel):
    """Return the bounding box of non-zero pixels in the alpha channel."""
    bbox = alpha_channel.getbbox()
    if bbox is None:
        raise ValueError("Alpha channel is entirely zero — wordmark not found!")
    return bbox


def make_variant(alpha, rgb_color, crop_box):
    """
    Build a cropped RGBA image with all pixels set to rgb_color
    and per-pixel alpha from the provided alpha channel.
    crop_box is (left, top, right, bottom).
    """
    alpha_cropped = alpha.crop(crop_box)
    w, h = alpha_cropped.size

    # Fill RGB with flat color
    r_chan = Image.new("L", (w, h), rgb_color[0])
    g_chan = Image.new("L", (w, h), rgb_color[1])
    b_chan = Image.new("L", (w, h), rgb_color[2])

    result = Image.merge("RGBA", (r_chan, g_chan, b_chan, alpha_cropped))
    return result


def verify(img, name):
    """Basic sanity checks: corner alpha = 0, center alpha > 200."""
    w, h = img.size
    corners = [
        img.getpixel((0, 0)),
        img.getpixel((w - 1, 0)),
        img.getpixel((0, h - 1)),
        img.getpixel((w - 1, h - 1)),
    ]
    corner_alphas = [px[3] for px in corners]
    center_alpha = img.getpixel((w // 2, h // 2))[3]

    print(f"\n  {name}: {w}x{h}px")
    print(f"    Corner alphas (TL/TR/BL/BR): {corner_alphas} → {'OK (all 0)' if all(a == 0 for a in corner_alphas) else 'WARN: non-zero corners'}")
    print(f"    Center alpha: {center_alpha} → {'OK (opaque)' if center_alpha > 200 else 'WARN: center not fully opaque'}")
    return w, h


def main():
    if not SRC.exists():
        sys.exit(f"ERROR: Source not found: {SRC}")

    print(f"Loading source: {SRC}")
    src = Image.open(SRC).convert("RGBA")
    print(f"  Source size: {src.size[0]}x{src.size[1]}px, mode: RGBA")

    # Quick sanity check: confirm source has opaque black corners
    corner_px = src.getpixel((0, 0))
    print(f"  Source corner pixel (RGBA): {corner_px}")
    if corner_px[3] != 255:
        print("  WARNING: Source corner alpha is not 255 — may already have transparency")

    print("\nComputing luminance mask...")
    alpha = compute_luminance_mask(src)

    print("Finding crop bounding box...")
    crop_box = autocrop_box(alpha)
    print(f"  Crop box: {crop_box} (L,T,R,B) → {crop_box[2]-crop_box[0]}x{crop_box[3]-crop_box[1]}px")

    print("\nGenerating logo-mark-white.png (white wordmark on transparent)...")
    white_img = make_variant(alpha, (255, 255, 255), crop_box)
    white_img.save(OUT_WHITE, "PNG", optimize=True)

    print("Generating logo-mark-ink.png (#0A0A0A wordmark on transparent)...")
    ink_img = make_variant(alpha, INK_COLOR, crop_box)
    ink_img.save(OUT_INK, "PNG", optimize=True)

    print("\n--- Verification ---")
    w_w, w_h = verify(white_img, "logo-mark-white.png")
    i_w, i_h = verify(ink_img,   "logo-mark-ink.png")

    print(f"\nDone.")
    print(f"  logo-mark-white.png → {OUT_WHITE} ({w_w}x{w_h}px)")
    print(f"  logo-mark-ink.png   → {OUT_INK} ({i_w}x{i_h}px)")


if __name__ == "__main__":
    main()
