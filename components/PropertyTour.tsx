import React from "react";

interface PropertyTourProps {
  url: string;
  title?: string;
}

/**
 * Convierte URLs de proveedores comunes a su forma "embed".
 * Matterport ya viene en forma embeddable; YouTube y Vimeo no.
 *
 * Si la URL no matchea ningún provider conocido pero es http(s),
 * la dejamos tal cual y el iframe carga directo. Esto cubre tours
 * subidos a Kuula, GoPano, Roundme, etc.
 */
function toEmbedUrl(url: string): { src: string; provider: string } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  // YouTube: https://www.youtube.com/watch?v=ID, https://youtu.be/ID,
  // o https://www.youtube.com/embed/ID
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (ytMatch) {
    return { src: `https://www.youtube.com/embed/${ytMatch[1]}`, provider: "YouTube" };
  }

  // Vimeo: https://vimeo.com/ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { src: `https://player.vimeo.com/video/${vimeoMatch[1]}`, provider: "Vimeo" };
  }

  // Matterport: https://my.matterport.com/show/?m=ID — ya es embeddable
  if (/matterport\.com/i.test(trimmed)) {
    return { src: trimmed, provider: "Matterport" };
  }

  // Cualquier otra URL http(s) — la cargamos directo, asumiendo que el broker
  // pegó un link de un proveedor que sirve contenido embeddable.
  if (/^https?:\/\//i.test(trimmed)) {
    return { src: trimmed, provider: "Tour virtual" };
  }

  return null;
}

export default function PropertyTour({ url, title = "Tour virtual" }: PropertyTourProps) {
  const embed = toEmbedUrl(url);
  if (!embed) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6 md:p-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="text-sm text-gray-600">
          Recorré la propiedad de manera virtual antes de visitarla en persona.
        </p>
      </div>
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={embed.src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
}
