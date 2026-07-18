# RealEstateX — Development Template

Plantilla Next.js para lanzar **un sitio por desarrollo inmobiliario** en preventa. Cada instancia del repo se despliega como el sitio único de un proyecto: hero editorial, disponibilidad en vivo, plan de pagos, calculadora de inversión, avance de obra y captura de leads calificados.

Showcase actual: **Cardón**, un proyecto boutique ficticio en East Cape, Baja California Sur.

## Stack

- Next.js 14 (Pages Router) + TypeScript
- Tailwind CSS con paleta y tipografía por configuración
- next-i18next (español / inglés)
- Resend para emails de leads + webhook opcional (Make, Zapier)
- Datos del proyecto en `data/development.ts` (single-file source of truth)

## Requisitos

- Node 18+

## Uso

```bash
npm install
npm run dev
# http://localhost:3000
```

## Personalizar el sitio para tu proyecto

Un despliegue = un desarrollo. Todo lo específico del proyecto vive en dos archivos:

### 1. `data/development.ts`
Contenido completo del desarrollo: nombre, tagline, concepto, ubicación, amenidades, modelos (tipologías), unidades (con status disponible / apartada / vendida), plan de pagos, supuestos de inversión, hitos de avance de obra, información del desarrollador. Cada campo con texto tiene su versión `es` y `en`.

### 2. `config/siteConfig.ts`
Branding + contacto + integraciones: nombre del sitio, URL, logo, paleta (primary, accent, ink, surface), tipografía (Fraunces / Cormorant / Playfair para display; Inter / Manrope para body), WhatsApp, email, redes sociales, `leadWebhookUrl`.

## Variables de entorno

```
RESEND_API_KEY=re_...              # opcional — sin esto, los leads sólo se loguean en consola
LEAD_FROM_EMAIL=hola@tudominio.com # opcional
ADMIN_PASSWORD=elige-una-fuerte    # login del admin (por implementar)
```

## Deploy

Compatible con cualquier host que soporte Next.js (Vercel, Netlify, Railway, Amplify). Sitemap y robots incluidos.

## Estado

- ✅ Landing público completo (hero + 10 secciones + captura de leads)
- ✅ API de leads (email vía Resend + webhook opcional)
- ✅ Bilingüe ES / EN
- ⏳ Admin panel (edición del desarrollo desde `/admin` — pendiente)
- ⏳ Script `setup-development` para clonar el template para un proyecto nuevo — pendiente
- ⏳ Brochure PDF auto-generado — pendiente

---

Diseñado para desarrolladores que buscan un sitio web que **luzca y convierta como ningún otro** en preventa.
