"use client";

import { ImagePlaceholder } from "./SmartImage";
import { assetPath } from "@/lib/config";

/**
 * Background hero video — autoplays muted, loops, plays inline, with a poster
 * for the first paint. Falls back to a poster image or styled placeholder if no
 * processed video exists, so the hero never breaks on an empty media folder.
 */
export default function HeroVideo({
  src,
  poster,
  className = "",
}: {
  src?: string | null;
  poster?: string | null;
  className?: string;
}) {
  if (!src) {
    if (poster) {
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          src={assetPath(poster)}
          alt="Premium kitchen interior showroom in Nairobi"
          className={`h-full w-full object-cover ${className}`}
        />
      );
    }
    return <ImagePlaceholder alt="Interior showroom video" className={`h-full w-full ${className}`} />;
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster ? assetPath(poster) : undefined}
      className={`h-full w-full object-cover ${className}`}
    >
      <source src={assetPath(src)} type="video/mp4" />
    </video>
  );
}
