/**
 * TESTIMONIOS DE CLIENTES
 *
 * Para agregar, editar o reordenar testimonios editá el array de abajo.
 * El orden del array es el orden en que aparecen en la web.
 *
 * Recomendación: 3-6 testimonios. Más que eso se vuelve ruido.
 */

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  rating: number; // 1 a 5
  role?: string; // Ej: "Cliente comprador", "Cliente inquilino"
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "María González",
    text: "Excelente servicio. Me ayudaron a encontrar exactamente lo que buscaba. Muy profesionales y atentos en todo momento.",
    rating: 5,
  },
  {
    id: "2",
    author: "Carlos Ramírez",
    text: "El proceso fue muy sencillo y transparente. Recomiendo totalmente sus servicios para encontrar tu próximo hogar.",
    rating: 5,
  },
  {
    id: "3",
    author: "Ana Martínez",
    text: "Profesionales de confianza. Me guiaron en cada paso y encontré mi departamento ideal en tiempo récord.",
    rating: 5,
  },
];

export function getTestimonials(limit?: number): Testimonial[] {
  return limit ? testimonials.slice(0, limit) : testimonials;
}
