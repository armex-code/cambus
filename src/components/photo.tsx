"use client";

import { useState } from "react";

/**
 * Plain image that removes itself if the file is missing, so photo slots
 * can ship before the photos are uploaded to public/images/.
 */
export function Photo({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setOk(false)}
    />
  );
}
