import React from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Hablamos 20 minutos",
    description:
      "Nos contás de tu marca, qué tipo de propiedades manejás, tus colores y datos de contacto. No hace falta que sepas nada técnico.",
  },
  {
    number: "02",
    title: "Te entregamos la web en 48hs",
    description:
      "Listo: tu dominio propio (o un subdominio temporal), tus colores, tu logo, hasta 50 propiedades cargadas y formulario de contacto activo.",
  },
  {
    number: "03",
    title: "Recibís leads en tu Gmail",
    description:
      "Cuando alguien pregunta por una propiedad, te llega un email con sus datos y la propiedad que mira. Respondés desde Gmail, sin entrar a ningún panel.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-slate-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-brand font-semibold text-sm uppercase tracking-wider mb-3">
            Cómo funciona
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            De cero a recibiendo leads
            <br />
            <span className="text-slate-500">en menos de 48 horas</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-brand/30 to-transparent"
            style={{ left: "16.66%", right: "16.66%" }}
          />

          {STEPS.map((step) => (
            <div key={step.number} className="relative bg-white rounded-2xl p-8 shadow-sm">
              <div className="absolute -top-4 left-8 bg-brand text-white font-bold text-sm px-3 py-1 rounded-full">
                Paso {step.number}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 mt-2">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600">
            No hay setup, no hay instalación, no hay aprender otro panel.{" "}
            <span className="text-slate-900 font-semibold">Nosotros hacemos el trabajo.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
