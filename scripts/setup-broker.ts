#!/usr/bin/env tsx
/**
 * SETUP-BROKER
 *
 * Script interactivo para onboardear un broker nuevo a partir de un clone
 * limpio del repo. Pide los datos esenciales y deja siteConfig, properties,
 * testimonials y aboutPage en un estado listo para empezar.
 *
 * Uso:  npm run setup-broker
 */

import fs from "fs";
import path from "path";
import prompts from "prompts";
import {
  BrokerInput,
  genSiteConfig,
  genEmptyProperties,
  genPlaceholderTestimonials,
  genResetAboutPage,
} from "./generators";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "config", "siteConfig.ts");
const PROPERTIES_PATH = path.join(ROOT, "data", "properties.ts");
const TESTIMONIALS_PATH = path.join(ROOT, "data", "testimonials.ts");
const ABOUT_PATH = path.join(ROOT, "data", "aboutPage.ts");
const ENV_LOCAL_PATH = path.join(ROOT, ".env.local");
const ENV_EXAMPLE_PATH = path.join(ROOT, ".env.example");

// ---------- helpers ----------

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function header(text: string) {
  const bar = "─".repeat(text.length + 4);
  console.log(`\n${bar}\n  ${text}\n${bar}`);
}

function info(text: string) {
  console.log(`  ${text}`);
}

function success(text: string) {
  console.log(`✓ ${text}`);
}

function warn(text: string) {
  console.warn(`⚠  ${text}`);
}

function abort(msg = "Cancelado por el usuario") {
  console.log(`\n${msg}\n`);
  process.exit(0);
}

// ---------- prompts ----------

async function ask(): Promise<BrokerInput> {
  header("Configuración del broker");
  info(
    "Respondé las preguntas. Podés presionar Ctrl+C para cancelar en cualquier momento."
  );

  const answers = await prompts(
    [
      {
        type: "text",
        name: "siteName",
        message: "Nombre del sitio (ej: Inmobiliaria Pérez)",
        validate: (v: string) => (v.trim() ? true : "Requerido"),
      },
      {
        type: "text",
        name: "siteUrl",
        message: "URL de producción (ej: https://perezbrokers.com)",
        initial: "https://example.com",
        validate: (v: string) =>
          /^https?:\/\/.+/.test(v.trim()) ? true : "Debe empezar con http:// o https://",
      },
      {
        type: "text",
        name: "logoText",
        message: "Texto del logo",
        initial: (_prev: string, values: BrokerInput) => values.siteName,
      },
      {
        type: "text",
        name: "primaryColor",
        message: "Color primario (hex, ej #008cb4)",
        initial: "#008cb4",
        validate: (v: string) =>
          HEX_REGEX.test(v.trim()) ? true : "Formato esperado: #rrggbb",
      },
      {
        type: "text",
        name: "secondaryColor",
        message: "Color secundario (hex)",
        initial: "#004d65",
        validate: (v: string) =>
          HEX_REGEX.test(v.trim()) ? true : "Formato esperado: #rrggbb",
      },
      {
        type: "text",
        name: "brokerName",
        message: "Nombre del broker (ej: Juan Pérez)",
        validate: (v: string) => (v.trim() ? true : "Requerido"),
      },
      {
        type: "text",
        name: "phone",
        message: "Teléfono visible (ej: +52 55 1234 5678)",
        validate: (v: string) => (v.trim() ? true : "Requerido"),
      },
      {
        type: "text",
        name: "whatsapp",
        message: "WhatsApp (solo dígitos con código de país, ej: 5215512345678)",
        validate: (v: string) =>
          /^\d{8,15}$/.test(v.trim()) ? true : "Solo dígitos, 8-15 caracteres",
      },
      {
        type: "text",
        name: "email",
        message: "Email del broker (recibe los leads)",
        validate: (v: string) =>
          EMAIL_REGEX.test(v.trim()) ? true : "Email inválido",
      },
      {
        type: "text",
        name: "city",
        message: "Ciudad principal (ej: Ciudad de México)",
        validate: (v: string) => (v.trim() ? true : "Requerido"),
      },
      {
        type: "text",
        name: "address",
        message: "Dirección de oficina (opcional, Enter para vacío)",
        initial: "",
      },
      {
        type: "text",
        name: "slogan",
        message: "Slogan o frase principal",
        initial: "Tu hogar ideal te está esperando",
      },
      {
        type: "text",
        name: "facebook",
        message: "URL de Facebook (Enter para omitir)",
        initial: "",
      },
      {
        type: "text",
        name: "instagram",
        message: "URL de Instagram (Enter para omitir)",
        initial: "",
      },
      {
        type: "text",
        name: "leadWebhookUrl",
        message: "Webhook para leads (Make/Zapier, Enter para omitir)",
        initial: "",
      },
    ],
    {
      onCancel: () => abort(),
    }
  );

  return answers as BrokerInput;
}

async function confirm(label: string): Promise<boolean> {
  const { ok } = await prompts(
    {
      type: "confirm",
      name: "ok",
      message: label,
      initial: true,
    },
    { onCancel: () => abort() }
  );
  return Boolean(ok);
}

// ---------- escritura ----------

function writeAll(b: BrokerInput) {
  fs.writeFileSync(CONFIG_PATH, genSiteConfig(b), "utf-8");
  success(`siteConfig.ts actualizado`);

  fs.writeFileSync(PROPERTIES_PATH, genEmptyProperties(), "utf-8");
  success(`data/properties.ts vaciado`);

  fs.writeFileSync(TESTIMONIALS_PATH, genPlaceholderTestimonials(), "utf-8");
  success(`data/testimonials.ts reseteado a placeholders`);

  fs.writeFileSync(ABOUT_PATH, genResetAboutPage(), "utf-8");
  success(`data/aboutPage.ts reseteado a template`);

  // Limpiar imágenes subidas previamente al admin
  const imagesDir = path.join(ROOT, "public", "images");
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    let cleaned = 0;
    for (const f of files) {
      if (f === ".gitkeep") continue;
      fs.unlinkSync(path.join(imagesDir, f));
      cleaned++;
    }
    if (cleaned > 0) success(`public/images/ limpiado (${cleaned} archivos)`);
  }
}

function ensureEnvLocal(b: BrokerInput) {
  if (fs.existsSync(ENV_LOCAL_PATH)) {
    warn(".env.local ya existe — no se modificó. Revisalo manualmente.");
    return;
  }
  if (!fs.existsSync(ENV_EXAMPLE_PATH)) {
    warn(".env.example no encontrado, no se creó .env.local");
    return;
  }
  const example = fs.readFileSync(ENV_EXAMPLE_PATH, "utf-8");
  fs.writeFileSync(ENV_LOCAL_PATH, example, "utf-8");
  success(".env.local creado desde .env.example (completá los valores)");
}

// ---------- main ----------

async function main() {
  console.log("\n🏠 RealEstateX — Setup broker\n");

  const input = await ask();

  console.log("\nResumen:");
  console.log(`  Sitio:   ${input.siteName} (${input.siteUrl})`);
  console.log(`  Broker:  ${input.brokerName}`);
  console.log(`  Contact: ${input.email} | WA: ${input.whatsapp}`);
  console.log(`  Ciudad:  ${input.city}`);
  console.log(`  Colores: ${input.primaryColor} / ${input.secondaryColor}`);

  warn(
    "\nEsto va a SOBRESCRIBIR siteConfig, properties (vacío), testimonials y aboutPage."
  );
  const proceed = await confirm("¿Continuar?");
  if (!proceed) abort();

  writeAll(input);
  ensureEnvLocal(input);

  header("Listo");
  info("Próximos pasos:");
  info("  1. Completar RESEND_API_KEY en .env.local para que lleguen leads por email");
  info("  2. npm run dev → abrir http://localhost:3000");
  info("  3. /admin → login con la contraseña de ADMIN_PASSWORD y cargar propiedades");
  info("  4. Reemplazar testimonios y foto del broker en data/");
  info("  5. git commit + deploy a Vercel\n");
}

main().catch((err) => {
  console.error("\n✗ Error:", err);
  process.exit(1);
});
