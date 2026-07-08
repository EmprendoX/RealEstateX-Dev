/**
 * CONTENIDO DE PÁGINA "SOBRE MÍ" Y SECCIÓN INTRO DEL HOME
 *
 * Todo el texto editorial vive acá. Para personalizar el sitio para otro
 * broker, basta con cambiar estos valores (sin tocar JSX).
 *
 * Variables de plantilla disponibles en los textos:
 *   {{city}}       → siteConfig.city
 *   {{brokerName}} → siteConfig.brokerName
 *
 * Estas variables se reemplazan automáticamente al renderizar.
 */

export interface AboutContent {
  /** URL de la foto del broker. Puede ser /images/foto.jpg o URL absoluta. */
  brokerPhoto: string;
  /** Rol mostrado debajo del nombre en la página About. */
  role: string;
  /** Sección "Sobre mí" del home — 3 párrafos cortos como teaser. */
  homeIntro: {
    heading: string;
    paragraphs: string[];
  };
  /** Bio extendida en la página /about (sección "Quién soy"). */
  bio: {
    heading: string;
    paragraphs: string[];
  };
  /** Sección "Cómo trabajo" en /about. */
  howIWork: {
    heading: string;
    intro: string;
    pillars: { title: string; description: string }[];
    outro?: string;
  };
  /** Sección "Por qué trabajar conmigo" en /about. */
  whyMe: {
    heading: string;
    items: { title: string; description: string }[];
  };
}

export const aboutContent: AboutContent = {
  brokerPhoto:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  role: "Broker Inmobiliario",

  homeIntro: {
    heading: "Tu asesor inmobiliario en {{city}}",
    paragraphs: [
      "Con años de experiencia en el mercado inmobiliario, me especializo en ayudar a personas y familias a encontrar su hogar ideal. Mi compromiso es brindarte un servicio personalizado y profesional que supere tus expectativas.",
      "Trabajo con las mejores propiedades en {{city}}, desde departamentos modernos hasta casas familiares, siempre buscando la mejor opción para cada cliente.",
      "Mi objetivo es hacer que el proceso de compra o renta de tu propiedad sea sencillo, transparente y exitoso.",
    ],
  },

  bio: {
    heading: "Quién soy",
    paragraphs: [
      "Soy {{brokerName}}, un profesional del sector inmobiliario con años de experiencia ayudando a personas y familias a encontrar su hogar ideal en {{city}}. Mi pasión por el sector inmobiliario comenzó cuando me di cuenta de lo importante que es encontrar el lugar perfecto para vivir.",
      "Mi objetivo es brindar un servicio personalizado, transparente y profesional que supere las expectativas de cada cliente. Trabajo con dedicación para entender tus necesidades y encontrar la propiedad que mejor se adapte a tu estilo de vida y presupuesto.",
    ],
  },

  howIWork: {
    heading: "Cómo trabajo",
    intro: "Mi metodología se basa en tres pilares fundamentales:",
    pillars: [
      {
        title: "Escucha activa",
        description:
          "Me tomo el tiempo necesario para entender tus necesidades, deseos y presupuesto.",
      },
      {
        title: "Selección cuidadosa",
        description:
          "Te presento solo las propiedades que realmente cumplen con tus criterios, ahorrándote tiempo y esfuerzo.",
      },
      {
        title: "Acompañamiento completo",
        description:
          "Te guío en cada paso del proceso, desde la búsqueda hasta la firma de documentos.",
      },
    ],
    outro:
      "Trabajo con las mejores propiedades disponibles en el mercado, desde departamentos modernos hasta casas familiares, siempre buscando la mejor opción para cada cliente.",
  },

  whyMe: {
    heading: "Por qué trabajar conmigo",
    items: [
      {
        title: "Experiencia comprobada",
        description:
          "Años de experiencia en el mercado inmobiliario de {{city}}.",
      },
      {
        title: "Atención personalizada",
        description: "Cada cliente es único y merece un servicio a su medida.",
      },
      {
        title: "Transparencia total",
        description: "Información clara y honesta en cada paso del proceso.",
      },
      {
        title: "Compromiso con resultados",
        description:
          "Trabajo incansablemente hasta encontrar tu propiedad ideal.",
      },
    ],
  },
};

/**
 * Versión en inglés del contenido editorial. Mantiene las mismas variables de
 * plantilla ({{city}}, {{brokerName}}). El precio/contexto local no aplica aquí.
 */
export const aboutContentEn: AboutContent = {
  brokerPhoto:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  role: "Real Estate Broker",

  homeIntro: {
    heading: "Your real estate advisor in {{city}}",
    paragraphs: [
      "With years of experience in the real estate market, I specialize in helping individuals and families find their ideal home. My commitment is to give you a personalized, professional service that exceeds your expectations.",
      "I work with the best properties in {{city}}, from modern apartments to family homes, always looking for the best option for each client.",
      "My goal is to make the process of buying or renting your property simple, transparent and successful.",
    ],
  },

  bio: {
    heading: "Who I am",
    paragraphs: [
      "I'm {{brokerName}}, a real estate professional with years of experience helping individuals and families find their ideal home in {{city}}. My passion for real estate began when I realized how important it is to find the perfect place to live.",
      "My goal is to provide a personalized, transparent and professional service that exceeds every client's expectations. I work with dedication to understand your needs and find the property that best fits your lifestyle and budget.",
    ],
  },

  howIWork: {
    heading: "How I work",
    intro: "My approach is built on three core pillars:",
    pillars: [
      {
        title: "Active listening",
        description:
          "I take the time needed to understand your needs, wishes and budget.",
      },
      {
        title: "Careful selection",
        description:
          "I only show you properties that truly meet your criteria, saving you time and effort.",
      },
      {
        title: "Full support",
        description:
          "I guide you through every step of the process, from the search to signing the paperwork.",
      },
    ],
    outro:
      "I work with the best properties available on the market, from modern apartments to family homes, always looking for the best option for each client.",
  },

  whyMe: {
    heading: "Why work with me",
    items: [
      {
        title: "Proven experience",
        description: "Years of experience in the {{city}} real estate market.",
      },
      {
        title: "Personalized attention",
        description: "Every client is unique and deserves a tailored service.",
      },
      {
        title: "Full transparency",
        description: "Clear and honest information at every step of the process.",
      },
      {
        title: "Commitment to results",
        description: "I work tirelessly until I find your ideal property.",
      },
    ],
  },
};

/**
 * Devuelve el contenido editorial en el idioma dado. Para "en" usa la versión
 * en inglés; en cualquier otro caso, español.
 */
export function getAboutContent(locale?: string): AboutContent {
  return locale === "en" ? aboutContentEn : aboutContent;
}

/**
 * Reemplaza las variables de plantilla ({{city}}, {{brokerName}})
 * en cualquier string del contenido.
 */
export function renderTemplate(
  text: string,
  vars: { city: string; brokerName: string }
): string {
  return text
    .replace(/\{\{city\}\}/g, vars.city)
    .replace(/\{\{brokerName\}\}/g, vars.brokerName);
}
