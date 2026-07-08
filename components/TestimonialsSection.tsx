import React from "react";
import { useTranslation } from "next-i18next";
import { Testimonial } from "@/data/testimonials";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  heading?: string;
}

export default function TestimonialsSection({
  testimonials,
  heading,
}: TestimonialsSectionProps) {
  const { t } = useTranslation("common");
  if (testimonials.length === 0) return null;

  const resolvedHeading = heading ?? t("testimonials.heading");

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          {resolvedHeading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => {
            const safeRating = Math.max(0, Math.min(5, Math.round(testimonial.rating)));
            return (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex mb-4" aria-label={t("testimonials.starsLabel", { count: safeRating })}>
                  {"⭐".repeat(safeRating)}
                </div>
                <p className="text-gray-700 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-semibold text-gray-900">- {testimonial.author}</p>
                {testimonial.role && (
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
