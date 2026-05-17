import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappMessage = encodeURIComponent(
    "Hola, me interesa una propiedad. ¿Me puedes dar más información?"
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información del sitio */}
          <div>
            <h3 className="text-xl font-bold mb-4">{siteConfig.siteName}</h3>
            <p className="text-gray-400 mb-4">{siteConfig.slogan}</p>
            <p className="text-gray-400 text-sm">
              {siteConfig.city} • {siteConfig.address}
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Propiedades
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sobre mí
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto y redes sociales */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="hover:text-white transition-colors"
                >
                  📞 {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors"
                >
                  ✉️ {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  💬 WhatsApp
                </a>
              </li>
            </ul>

            {/* Redes sociales */}
            {(siteConfig.facebook ||
              siteConfig.instagram ||
              siteConfig.tiktok ||
              siteConfig.linkedin) && (
              <div className="mt-6">
                <h5 className="text-sm font-semibold mb-2">Síguenos</h5>
                <div className="flex space-x-4">
                  {siteConfig.facebook && (
                    <a
                      href={siteConfig.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      Facebook
                    </a>
                  )}
                  {siteConfig.instagram && (
                    <a
                      href={siteConfig.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      Instagram
                    </a>
                  )}
                  {siteConfig.tiktok && (
                    <a
                      href={siteConfig.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="TikTok"
                    >
                      TikTok
                    </a>
                  )}
                  {siteConfig.linkedin && (
                    <a
                      href={siteConfig.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            © {currentYear} {siteConfig.siteName}. Todos los derechos
            reservados.
          </p>
          <p className="mt-2">
            Desarrollado por {siteConfig.brokerName}
          </p>
        </div>
      </div>
    </footer>
  );
}


