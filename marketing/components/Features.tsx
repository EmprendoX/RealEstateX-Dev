import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const iconClass = "w-6 h-6";

const FEATURES: Feature[] = [
  {
    icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Tu marca, tu dominio",
    description: "No competís en portales contra otros 5.000 anuncios. Tu propia web con tu logo, colores y datos de contacto.",
  },
  {
    icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    title: "SEO real, no genérico",
    description: "Cada propiedad indexada con Schema.org RealEstateListing. Google muestra precio, m² y ubicación en los resultados.",
  },
  {
    icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Leads directos a tu inbox",
    description: "Cuando alguien pregunta por una propiedad, recibís un email con sus datos. Respondés desde tu Gmail como una conversación normal.",
  },
  {
    icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Galería + mapa + tour 360°",
    description: "Lightbox fullscreen, mapa con la ubicación, soporte para tours Matterport/YouTube. Lo que el comprador espera ver.",
  },
  {
    icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "PDF de cada propiedad",
    description: "Tus visitantes descargan una ficha profesional con tu marca y tus datos. Vos la imprimís para reuniones o la mandás por WhatsApp.",
  },
  {
    icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h6M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-3-2-3 2-3-2-3 2V5z" />
      </svg>
    ),
    title: "Calculadora de hipoteca",
    description: "El visitante mueve sliders y ve cuánto pagaría por mes. Los que se quedan calculando son los que están listos para comprar.",
  },
  {
    icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Favoritos + comparador",
    description: "El visitante guarda propiedades, las compara lado a lado y comparte el link con su pareja o socio. Mayor tiempo en la página.",
  },
  {
    icon: (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Panel para administrar",
    description: "Subís propiedades, fotos, precios y descripciones desde un panel simple. No necesitás tocar código ni esperarnos a nosotros.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-brand font-semibold text-sm uppercase tracking-wider mb-3">
            Lo que incluye
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Todo lo que esperás de un portal
            <br />
            <span className="text-slate-500">en tu propia web</span>
          </h2>
          <p className="text-lg text-slate-600">
            Features que tienen Idealista, Zillow y Lamudi, pero con tu marca y tus leads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
