#!/usr/bin/env bash
#
# process-videos.sh
# -----------------
# Pre-build video pipeline for Gordon Sales Guru.
#
# For every raw clip in /assets/videos/ this script produces a web-ready,
# muted, HD MP4 in /media/videos/ plus a WebP poster frame. The first processed
# clip becomes the hero background loop on /products.
#
#  * Source >= 1080p  -> re-encode to H.264 CRF 18 (high quality, web friendly)
#  * Source <  1080p  -> upscale to 1920x1080 with the lanczos filter
#  * Audio is stripped (these autoplay muted as background loops)
#  * A poster.webp is grabbed from ~2s in for each clip
#  * Exact duplicates (identical byte size) are skipped
#  * Empty /assets/videos/ -> logs and exits 0 (never breaks the build)
#
# Requires: ffmpeg + ffprobe on PATH.
# Usage:    bash scripts/process-videos.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT/assets/videos"
OUT_DIR="$ROOT/public/media/videos"

echo "Gordon Sales Guru — video processing"
echo "===================================="

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found on PATH — skipping video processing."
  exit 0
fi

if [ ! -d "$SRC_DIR" ]; then
  echo "No video folder at $SRC_DIR — nothing to process. Skipping."
  exit 0
fi

shopt -s nullglob nocaseglob
videos=("$SRC_DIR"/*.mp4 "$SRC_DIR"/*.mov "$SRC_DIR"/*.mkv "$SRC_DIR"/*.avi "$SRC_DIR"/*.webm "$SRC_DIR"/*.m4v)
shopt -u nullglob nocaseglob

if [ ${#videos[@]} -eq 0 ]; then
  echo "Video folder is empty — nothing to process. Skipping."
  exit 0
fi

mkdir -p "$OUT_DIR"

declare -A seen_sizes
index=0

for src in "${videos[@]}"; do
  [ -f "$src" ] || continue

  # de-duplicate identical clips by byte size
  size=$(wc -c < "$src" | tr -d ' ')
  if [ -n "${seen_sizes[$size]:-}" ]; then
    echo "  skip (duplicate of ${seen_sizes[$size]}): $(basename "$src")"
    continue
  fi
  seen_sizes[$size]="$(basename "$src")"

  index=$((index + 1))
  out_name=$(printf "interior-tour-%02d" "$index")
  out_mp4="$OUT_DIR/$out_name.mp4"
  out_poster="$OUT_DIR/$out_name-poster.webp"

  # decide whether we need to upscale
  height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src" 2>/dev/null || echo 0)
  if [ "${height:-0}" -lt 1080 ] 2>/dev/null; then
    scale_filter="scale=1920:1080:flags=lanczos"
    echo "  upscaling to 1080p: $(basename "$src") -> $out_name.mp4"
  else
    scale_filter="scale=trunc(iw/2)*2:trunc(ih/2)*2"
    echo "  re-encoding (>=1080p): $(basename "$src") -> $out_name.mp4"
  fi

  # H.264 CRF 18, audio stripped, web-optimised (faststart)
  ffmpeg -y -loglevel error -i "$src" \
    -vf "$scale_filter" \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
    -movflags +faststart -an \
    "$out_mp4"

  # poster frame from ~2s in (fall back to first frame on very short clips)
  ffmpeg -y -loglevel error -ss 00:00:02 -i "$out_mp4" -frames:v 1 "$out_poster" \
    || ffmpeg -y -loglevel error -i "$out_mp4" -frames:v 1 "$out_poster"

  echo "    poster: $out_name-poster.webp"
done

echo "------------------------------------"
echo "Processed $index clip(s) into /media/videos/."
echo "Hero loop: interior-tour-01.mp4 (rename any clip to promote it)."
