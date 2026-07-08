/**
 * TESTIMONIOS DE CLIENTES
 *
 * Para agregar, editar o reordenar testimonios editá el array de abajo.
 * El orden del array es el orden en que aparecen en la web.
 *
 * Recomendación: 3-6 testimonios. Más que eso se vuelve ruido.
 *
 * Campos "*En" (textEn, roleEn) son opcionales: si faltan, se usa el texto
 * en español como respaldo.
 */

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  /** Traducción al inglés del testimonio (opcional). */
  textEn?: string;
  rating: number; // 1 a 5
  role?: string; // Ej: "Cliente comprador", "Cliente inquilino"
  /** Traducción al inglés del rol (opcional). */
  roleEn?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "María González",
    text: "Excelente servicio. Me ayudaron a encontrar exactamente lo que buscaba. Muy profesionales y atentos en todo momento.",
    textEn: "Excellent service. They helped me find exactly what I was looking for. Very professional and attentive at all times.",
    rating: 5,
  },
  {
    id: "2",
    author: "Carlos Ramírez",
    text: "El proceso fue muy sencillo y transparente. Recomiendo totalmente sus servicios para encontrar tu próximo hogar.",
    textEn: "The process was very simple and transparent. I fully recommend their services for finding your next home.",
    rating: 5,
  },
  {
    id: "3",
    author: "Ana Martínez",
    text: "Profesionales de confianza. Me guiaron en cada paso y encontré mi departamento ideal en tiempo récord.",
    textEn: "Trustworthy professionals. They guided me every step of the way and I found my ideal apartment in record time.",
    rating: 5,
  },
];

/**
 * Devuelve una copia del testimonio con los campos de texto en el idioma dado.
 * Para "en" usa textEn/roleEn si existen; de lo contrario, español.
 */
export function localizeTestimonial(
  testimonial: Testimonial,
  locale?: string
): Testimonial {
  if (locale !== "en") return testimonial;
  return {
    ...testimonial,
    text: testimonial.textEn ?? testimonial.text,
    role: testimonial.roleEn ?? testimonial.role,
  };
}

export function getTestimonials(limit?: number, locale?: string): Testimonial[] {
  const list = limit ? testimonials.slice(0, limit) : testimonials;
  return list.map((testimonial) => localizeTestimonial(testimonial, locale));
}
