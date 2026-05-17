import React from "react";

export default function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <span className="text-xl font-bold text-white">RealEstateX</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm">
            Features
          </a>
          <a href="#how" className="text-slate-300 hover:text-white transition-colors text-sm">
            Cómo funciona
          </a>
          <a href="#contact" className="text-slate-300 hover:text-white transition-colors text-sm">
            Contacto
          </a>
        </nav>
        <a
          href="#contact"
          className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          Agendar demo
        </a>
      </div>
    </header>
  );
}
