# RealEstateX - Plantilla Web para Brokers Inmobiliarios

Una plantilla web profesional, moderna y fácil de personalizar para brokers inmobiliarios. Construida con Next.js, TypeScript y Tailwind CSS.

## 🚀 Características

- ✅ Diseño moderno y responsive (mobile-first)
- ✅ Configuración centralizada en un solo archivo
- ✅ Sistema de propiedades fácil de gestionar
- ✅ Formulario de contacto con validación
- ✅ Preparado para automatizaciones (webhooks, chat widgets)
- ✅ Optimizado para SEO
- ✅ Fácil de duplicar y personalizar

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## ⚙️ Personalización

### 1. Configuración General del Sitio

Edita el archivo `config/siteConfig.ts` para personalizar:

- **Información del sitio:**
  - `siteName`: Nombre del sitio
  - `logoText`: Texto del logo (o `logoUrl` para imagen)
  - `primaryColor` y `secondaryColor`: Colores principales (formato hex)

- **Datos del broker:**
  - `brokerName`: Tu nombre completo
  - `phone`, `whatsapp`, `email`: Datos de contacto
  - `city`, `address`: Ubicación
  - `slogan`: Tu eslogan o frase principal

- **Redes sociales:**
  - Agrega las URLs de tus redes sociales (opcional)

- **Automatizaciones:**
  - `leadWebhookUrl`: URL del webhook para enviar leads automáticamente
  - `chatScript`: Script HTML/JS del widget de chat (Crisp, Intercom, etc.)

### 2. Agregar Propiedades

Edita el archivo `data/properties.ts`:

1. **Agregar una nueva propiedad:**
   ```typescript
   {
     id: "6",
     slug: "mi-nueva-propiedad",
     title: "Título de la propiedad",
     description: "Descripción detallada...",
     type: "venta", // o "renta"
     price: 1500000,
     currency: "MXN", // o "USD"
     location: "Colonia, Calle",
     city: "Ciudad de México",
     bedrooms: 3,
     bathrooms: 2,
     parking: 1,
     area: 120,
     featured: true, // Si quieres que aparezca en destacadas
     images: [
       "https://url-de-imagen-1.jpg",
       "https://url-de-imagen-2.jpg",
     ],
   }
   ```

2. **Usar imágenes locales:**
   - Coloca las imágenes en `public/images/`
   - Usa rutas relativas: `images/mi-imagen.jpg`

### 3. Cambiar Colores

Los colores se definen en `config/siteConfig.ts`:

```typescript
primaryColor: "#0EA5E9",   // Color principal
secondaryColor: "#06B6D4", // Color secundario
```

Los colores se aplican automáticamente en toda la aplicación.

### 4. Agregar Logo

Tienes dos opciones:

1. **Logo de texto:** Ya configurado con `logoText`
2. **Logo de imagen:** Agrega la URL en `logoUrl` dentro de `config/siteConfig.ts`

## 🔄 Duplicar el Sitio para Otro Broker

Para crear una nueva web para otro broker:

1. **Duplica la carpeta del proyecto**

2. **Cambia la configuración:**
   - Edita `config/siteConfig.ts` con los nuevos datos
   - Actualiza `data/properties.ts` con las nuevas propiedades

3. **Opcionalmente configura:**
   - `leadWebhookUrl` si quieres enviar leads a un CRM
   - `chatScript` si quieres agregar un widget de chat

4. **Instala dependencias y ejecuta:**
   ```bash
   npm install
   npm run dev
   ```

## 📡 Automatizaciones

### Webhook para Leads

Para recibir leads automáticamente en tu CRM o herramienta de automatización:

1. Crea un webhook en tu plataforma (Make, Zapier, etc.)
2. Copia la URL del webhook
3. Pégala en `siteConfig.leadWebhookUrl` en `config/siteConfig.ts`

El webhook recibirá un JSON con:
```json
{
  "name": "Nombre del cliente",
  "email": "email@ejemplo.com",
  "phone": "+52 55 1234 5678",
  "message": "Mensaje del cliente",
  "propertyId": "1",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "siteName": "RealEstateX",
  "brokerName": "Juan Pérez",
  "city": "Ciudad de México"
}
```

### Widget de Chat

Para agregar un widget de chat (Crisp, Intercom, Tidio, etc.):

1. Obtén el script de instalación de tu proveedor
2. Pégalo en `siteConfig.chatScript` en `config/siteConfig.ts`

Ejemplo:
```typescript
chatScript: '<script type="text/javascript">window.$crisp=[];...</script>'
```

## 🏗️ Estructura del Proyecto

```
RealEstateX/
├── config/
│   └── siteConfig.ts          # Configuración centralizada
├── data/
│   └── properties.ts          # Datos de propiedades
├── components/
│   ├── Layout.tsx             # Layout principal
│   ├── Navbar.tsx            # Barra de navegación
│   ├── Footer.tsx            # Pie de página
│   ├── PropertyCard.tsx      # Tarjeta de propiedad
│   ├── PropertyGrid.tsx      # Grid de propiedades
│   ├── PropertyHero.tsx      # Hero del detalle
│   └── ContactForm.tsx       # Formulario de contacto
├── pages/
│   ├── index.tsx             # Página de inicio
│   ├── about.tsx            # Sobre mí
│   ├── contact.tsx          # Contacto
│   ├── properties/
│   │   ├── index.tsx        # Listado de propiedades
│   │   └── [slug].tsx       # Detalle de propiedad
│   └── api/
│       └── contact.ts       # API endpoint para leads
├── styles/
│   └── globals.css          # Estilos globales
└── utils/
    └── formatPrice.ts       # Helper para formatear precios
```

## 🚢 Despliegue

### Vercel (Recomendado)

1. Sube tu proyecto a GitHub
2. Conecta tu repositorio en [Vercel](https://vercel.com)
3. Vercel detectará automáticamente Next.js y desplegará

### Otros Proveedores

El proyecto es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📝 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🐛 Solución de Problemas

### Las imágenes no se cargan

- Verifica que las URLs de las imágenes sean correctas
- Si usas imágenes locales, asegúrate de que estén en `public/images/`
- Revisa `next.config.js` para agregar dominios externos si es necesario

### Los colores no cambian

- Verifica que los colores en `siteConfig.ts` estén en formato hex (ej: `#0EA5E9`)
- Reinicia el servidor de desarrollo después de cambiar los colores

### El formulario no envía

- Revisa la consola del navegador para ver errores
- Verifica que el endpoint `/api/contact` esté funcionando
- Revisa los logs del servidor en la terminal

## 📄 Licencia

Este proyecto es una plantilla libre para uso personal y comercial.

## 🤝 Soporte

Para preguntas o problemas, revisa la documentación de Next.js y Tailwind CSS.

---

**Desarrollado con ❤️ para brokers inmobiliarios**


