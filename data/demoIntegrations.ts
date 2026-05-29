/**
 * DATOS DE DEMOSTRACIÓN — Plataforma API-first
 *
 * Catálogo de conectores, servidores MCP, API keys y automatizaciones que
 * alimentan los módulos de "plataforma" del panel admin. Son datos de fachada
 * para demos/videos: se ven y se sienten reales, pero no realizan conexiones
 * efectivas. El estado del usuario (qué está conectado, keys generadas, etc.)
 * se guarda en localStorage vía useDemoState.
 */

export type IntegrationCategory =
  | "IA"
  | "Mensajería"
  | "Correo"
  | "Automatización"
  | "Analítica"
  | "Marketing"
  | "Portales"
  | "CRM"
  | "Pagos";

export interface Connector {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  icon: string; // emoji para evitar dependencias de assets
  accent: string; // clase tailwind para el fondo del ícono
  /** Etiqueta del campo de credencial que pide el modal de conexión */
  credentialLabel: string;
  /** Si arranca conectado por defecto (para que el demo se vea "vivo") */
  defaultConnected?: boolean;
}

export const CONNECTORS: Connector[] = [
  {
    id: "anthropic",
    name: "Anthropic Claude",
    category: "IA",
    description: "Motor de IA para el chat, calificación de leads y generación de copys.",
    icon: "🧠",
    accent: "bg-orange-100",
    credentialLabel: "API Key (sk-ant-...)",
    defaultConnected: true,
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "IA",
    description: "Modelos GPT como alternativa para texto, embeddings y voz.",
    icon: "🤖",
    accent: "bg-emerald-100",
    credentialLabel: "API Key (sk-...)",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "Mensajería",
    description: "Conversaciones automáticas y manuales con leads por WhatsApp.",
    icon: "💬",
    accent: "bg-green-100",
    credentialLabel: "Phone Number ID + Token",
    defaultConnected: true,
  },
  {
    id: "resend",
    name: "Resend",
    category: "Correo",
    description: "Envío transaccional de correos: leads, seguimientos y secuencias.",
    icon: "✉️",
    accent: "bg-blue-100",
    credentialLabel: "API Key (re_...)",
    defaultConnected: true,
  },
  {
    id: "make",
    name: "Make",
    category: "Automatización",
    description: "Orquestá flujos visuales con cientos de apps externas.",
    icon: "⚙️",
    accent: "bg-purple-100",
    credentialLabel: "Webhook URL",
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "Automatización",
    description: "Conectá RealEstateX con +6.000 aplicaciones sin código.",
    icon: "⚡",
    accent: "bg-amber-100",
    credentialLabel: "Webhook URL",
  },
  {
    id: "n8n",
    name: "n8n",
    category: "Automatización",
    description: "Automatizaciones self-hosted y open source.",
    icon: "🔗",
    accent: "bg-rose-100",
    credentialLabel: "Webhook URL",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    category: "Analítica",
    description: "Medición de visitas, fuentes de tráfico y conversiones.",
    icon: "📊",
    accent: "bg-yellow-100",
    credentialLabel: "Measurement ID (G-...)",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    category: "Marketing",
    description: "Sincronizá leads y publicá propiedades en Facebook e Instagram.",
    icon: "📣",
    accent: "bg-sky-100",
    credentialLabel: "Access Token",
  },
  {
    id: "inmuebles24",
    name: "Inmuebles24",
    category: "Portales",
    description: "Publicá tu inventario automáticamente en el portal.",
    icon: "🏠",
    accent: "bg-indigo-100",
    credentialLabel: "Credenciales del portal",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    category: "CRM",
    description: "Cada lead se crea como contacto y se mueve por el pipeline.",
    icon: "📇",
    accent: "bg-orange-100",
    credentialLabel: "Private App Token",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Pagos",
    description: "Cobrá apartados, reservas y comisiones con tarjeta.",
    icon: "💳",
    accent: "bg-violet-100",
    credentialLabel: "Secret Key (sk_live_...)",
  },
];

/** Endpoints públicos que expone la "API v1" (se muestran en la pestaña API Keys) */
export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  { method: "GET", path: "/api/v1/properties", description: "Listar propiedades (filtros, paginación)" },
  { method: "GET", path: "/api/v1/properties/{id}", description: "Detalle de una propiedad" },
  { method: "POST", path: "/api/v1/properties", description: "Crear una propiedad" },
  { method: "PUT", path: "/api/v1/properties/{id}", description: "Actualizar una propiedad" },
  { method: "POST", path: "/api/v1/leads", description: "Registrar un lead entrante" },
  { method: "GET", path: "/api/v1/leads", description: "Listar leads capturados" },
  { method: "GET", path: "/api/v1/analytics/summary", description: "Métricas agregadas del sitio" },
];

export interface ApiKey {
  id: string;
  name: string;
  key: string; // valor completo (se muestra enmascarado salvo al crearla)
  createdAt: string; // ISO
  lastUsed: string | null;
}

/** Una key sembrada para que la pantalla no arranque vacía en el demo */
export const DEFAULT_API_KEYS: ApiKey[] = [
  {
    id: "key_prod",
    name: "Producción",
    key: "rex_live_8Kf2pQ9mZx4Tn7Lw1Rb6Vc3Yd5Hg0Js",
    createdAt: "2026-04-12T10:30:00.000Z",
    lastUsed: "2026-05-28T18:42:00.000Z",
  },
];

export interface McpServer {
  id: string;
  name: string;
  transport: "http" | "stdio";
  target: string; // URL o comando
  status: "connected" | "disconnected";
  tools: string[];
}

export const DEFAULT_MCP_SERVERS: McpServer[] = [
  {
    id: "mcp_properties",
    name: "RealEstateX Properties",
    transport: "http",
    target: "https://mcp.realestatex.com/properties",
    status: "connected",
    tools: ["search_properties", "get_property", "create_lead", "schedule_visit"],
  },
  {
    id: "mcp_calendar",
    name: "Agenda / Visitas",
    transport: "stdio",
    target: "npx -y @realestatex/mcp-calendar",
    status: "connected",
    tools: ["list_slots", "book_visit"],
  },
];

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  enabled: boolean;
  runs: number;
}

export const DEFAULT_AUTOMATIONS: Automation[] = [
  {
    id: "auto_lead_welcome",
    name: "Nuevo lead → WhatsApp + CRM",
    trigger: "lead.created",
    actions: ["Enviar WhatsApp de bienvenida", "Crear contacto en HubSpot"],
    enabled: true,
    runs: 128,
  },
  {
    id: "auto_followup",
    name: "Lead sin respuesta 24h → Email de seguimiento",
    trigger: "lead.idle.24h",
    actions: ["Generar email con IA", "Enviar vía Resend"],
    enabled: true,
    runs: 47,
  },
  {
    id: "auto_publish_social",
    name: "Propiedad publicada → Post en redes",
    trigger: "property.published",
    actions: ["Generar copy con Claude", "Publicar en Meta Ads"],
    enabled: false,
    runs: 12,
  },
  {
    id: "auto_visit_reminder",
    name: "Visita agendada → Recordatorio por SMS",
    trigger: "visit.scheduled",
    actions: ["Programar recordatorio 2h antes", "Enviar SMS"],
    enabled: true,
    runs: 33,
  },
];

/** Plantillas para el historial de ejecuciones (se sellan con tiempos al render) */
export const RUN_LOG_TEMPLATES: {
  automation: string;
  status: "success" | "success" | "running" | "error";
  detail: string;
  minutesAgo: number;
}[] = [
  { automation: "Nuevo lead → WhatsApp + CRM", status: "success", detail: "Lead 'María González' → WhatsApp enviado, contacto creado", minutesAgo: 4 },
  { automation: "Visita agendada → Recordatorio por SMS", status: "success", detail: "Visita Depto. Reforma 123 → recordatorio programado", minutesAgo: 26 },
  { automation: "Lead sin respuesta 24h → Email de seguimiento", status: "success", detail: "Email generado y enviado a carlos@mail.com", minutesAgo: 73 },
  { automation: "Nuevo lead → WhatsApp + CRM", status: "running", detail: "Lead 'Jorge Méndez' → ejecutando acciones…", minutesAgo: 1 },
  { automation: "Nuevo lead → WhatsApp + CRM", status: "success", detail: "Lead 'Ana Ruiz' → WhatsApp enviado, contacto creado", minutesAgo: 142 },
  { automation: "Propiedad publicada → Post en redes", status: "error", detail: "Meta Ads sin conexión — reintento programado", minutesAgo: 210 },
  { automation: "Lead sin respuesta 24h → Email de seguimiento", status: "success", detail: "Email generado y enviado a laura@mail.com", minutesAgo: 320 },
];
