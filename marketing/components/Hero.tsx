import React from "react";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative bg-slate-950 text-white overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32"
    >
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(79,70,229,0.5) 0%, rgba(79,70,229,0) 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-300">Para brokers inmobiliarios independientes y agencias chicas</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            La web inmobiliaria que tus competidores{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              no tienen
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Web profesional con tu marca, SEO real, fichas en PDF, calculadora
            de hipoteca y leads directos a tu inbox.{" "}
            <span className="text-white font-semibold">Lista en 48 horas.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors inline-flex items-center justify-center gap-2"
            >
              Agendar demo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              href="#features"
              className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors"
            >
              Ver qué incluye
            </a>
          </div>

          <p className="text-sm text-slate-400 mt-6">
            Sin compromisos, sin contratos largos. Probás y decidís.
          </p>
        </div>

        {/* Mockup / preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-slate-900 rounded-xl p-2 shadow-2xl border border-white/10 max-w-5xl mx-auto">
            <div className="flex items-center gap-1.5 px-3 py-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 mx-4 bg-slate-800 rounded px-3 py-1 text-xs text-slate-400">
                juanperez.com/properties/casa-moderna-santa-fe
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden aspect-[16/9] grid place-items-center text-slate-400">
              <div className="text-center px-8">
                <div className="text-6xl mb-4">🏠</div>
                <p className="font-semibold text-slate-900 mb-1">Preview de la web del broker</p>
                <p className="text-sm text-slate-500">Cada cliente tiene su dominio y su marca</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
