import React from "react";
import { Testimonial } from "@/data/testimonials";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  heading?: string;
}

export default function TestimonialsSection({
  testimonials,
  heading = "Lo que dicen nuestros clientes",
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => {
            const safeRating = Math.max(0, Math.min(5, Math.round(t.rating)));
            return (
              <div key={t.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex mb-4" aria-label={`${safeRating} de 5 estrellas`}>
                  {"⭐".repeat(safeRating)}
                </div>
                <p className="text-gray-700 mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-gray-900">- {t.author}</p>
                {t.role && (
                  <p className="text-sm text-gray-500">{t.role}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
