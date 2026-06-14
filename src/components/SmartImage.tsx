"use client";

import Image from "next/image";
import { useState } from "react";
import { assetPath } from "@/lib/config";

/**
 * next/image wrapper with:
 *  - a skeleton shimmer while the image decodes
 *  - a graceful, styled placeholder when no source exists (empty folders never
 *    produce broken images or blank gaps)
 */

interface SmartImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  rounded?: boolean;
}

export default function SmartImage({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  className = "",
  imgClassName = "",
  priority = false,
  rounded = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return <ImagePlaceholder alt={alt} className={className} rounded={rounded} />;
  }

  const radius = rounded ? "rounded-card" : "";

  return (
    <div
      className={`relative overflow-hidden bg-sky ${radius} ${className} ${
        loaded ? "" : "skeleton"
      }`}
    >
      <Image
        // Mark loaded immediately if the image is already complete (cached /
        // priority images can finish before React attaches onLoad).
        ref={(el) => {
          if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
        }}
        src={src.startsWith("/") ? assetPath(src) : src}
        alt={alt}
        {...(fill ? { fill: true } : { width: width ?? 800, height: height ?? 600 })}
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        // The image is ALWAYS visible; the skeleton sits behind it and is simply
        // covered once the (opaque) photo paints. Never gate visibility on onLoad.
        className={`${fill ? "object-cover" : ""} ${imgClassName}`}
      />
    </div>
  );
}

export function ImagePlaceholder({
  alt,
  className = "",
  rounded = false,
}: {
  alt: string;
  className?: string;
  rounded?: boolean;
}) {
  const radius = rounded ? "rounded-card" : "";
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex items-center justify-center bg-sky text-blue ${radius} ${className}`}
    >
      <div className="hero-texture pointer-events-none absolute inset-0 opacity-30" />
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="opacity-50"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.6" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}
