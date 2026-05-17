import React, { useMemo } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { properties as allProperties, Property } from "@/data/properties";
import { formatPrice } from "@/utils/formatPrice";
import { siteConfig } from "@/config/siteConfig";

const MAX_COMPARE = 3;

interface ComparePageProps {
  properties: Property[];
}

interface Row {
  label: string;
  /** Función que toma una propiedad y devuelve el valor a mostrar. */
  value: (p: Property) => React.ReactNode;
  /** Cuando todas las celdas son iguales, atenuamos la fila para resaltar diferencias. */
  highlight?: boolean;
}

const ROWS: Row[] = [
  {
    label: "Precio",
    value: (p) => (
      <span className="text-xl font-bold text-primary">
        {formatPrice(p.price, p.currency)}
      </span>
    ),
  },
  { label: "Tipo", value: (p) => (p.type === "venta" ? "Venta" : "Renta") },
  { label: "Ubicación", value: (p) => `${p.location}, ${p.city}` },
  { label: "Recámaras", value: (p) => p.bedrooms },
  { label: "Baños", value: (p) => p.bathrooms },
  { label: "Estacionamientos", value: (p) => p.parking },
  { label: "Área", value: (p) => `${p.area} m²` },
  { label: "Destacada", value: (p) => (p.featured ? "Sí" : "No") },
];

export default function ComparePage({ properties: allProps }: ComparePageProps) {
  const router = useRouter();
  const idsParam = router.query.ids;
  const ids = useMemo(() => {
    if (typeof idsParam !== "string") return [];
    return idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_COMPARE);
  }, [idsParam]);

  const compared = useMemo(
    () => ids.map((id) => allProps.find((p) => p.id === id)).filter((p): p is Property => !!p),
    [ids, allProps]
  );

  const whatsappForProperty = (p: Property) => {
    const msg = encodeURIComponent(
      `Hola, me interesa la propiedad: ${p.title}. ¿Me puedes dar más información?`
    );
    return `https://wa.me/${siteConfig.whatsapp}?text=${msg}`;
  };

  return (
    <Layout title="Comparar propiedades" canonicalPath="/compare" noindex>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Comparar propiedades
            </h1>
            <p className="text-gray-600">
              Hasta {MAX_COMPARE} propiedades lado a lado
            </p>
          </div>

          {compared.length < 2 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-2xl mx-auto">
              <div className="text-5xl mb-4">⚖️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Necesitás al menos 2 propiedades
              </h2>
              <p className="text-gray-600 mb-6">
                Ingresá a Favoritos, marcá 2 o 3 propiedades y tocá
                "Comparar".
              </p>
              <Link
                href="/favorites"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Ir a Favoritos
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-4 bg-gray-50 border-b border-gray-200 w-40 align-top">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Característica
                        </span>
                      </th>
                      {compared.map((p) => (
                        <th
                          key={p.id}
                          className="p-4 bg-gray-50 border-b border-l border-gray-200 align-top text-left"
                          style={{ minWidth: 240 }}
                        >
                          <div className="space-y-3">
                            <div className="relative h-40 rounded-md overflow-hidden">
                              <Image
                                src={p.images[0]}
                                alt={p.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            </div>
                            <Link
                              href={`/properties/${p.slug}`}
                              className="block font-bold text-gray-900 hover:text-primary transition-colors text-base leading-snug"
                            >
                              {p.title}
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row) => {
                      const values = compared.map((p) => row.value(p));
                      const stringValues = values.map((v) => String(v));
                      const allEqual = stringValues.every((v) => v === stringValues[0]);
                      return (
                        <tr key={row.label} className={allEqual ? "opacity-60" : ""}>
                          <th className="text-left p-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 align-top">
                            {row.label}
                          </th>
                          {compared.map((p, i) => (
                            <td
                              key={p.id}
                              className="p-4 border-b border-l border-gray-200 text-gray-900 align-top"
                            >
                              {values[i]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    <tr>
                      <th className="text-left p-4 bg-gray-50 text-sm font-medium text-gray-700 align-top">
                        Acciones
                      </th>
                      {compared.map((p) => (
                        <td key={p.id} className="p-4 border-l border-gray-200 align-top">
                          <div className="flex flex-col gap-2">
                            <Link
                              href={`/properties/${p.slug}`}
                              className="bg-primary hover:bg-primary/90 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                            >
                              Ver detalles
                            </Link>
                            <a
                              href={whatsappForProperty(p)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 hover:bg-green-600 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
                Las filas atenuadas son iguales en todas las propiedades.
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/favorites"
              className="text-primary hover:underline font-medium"
            >
              ← Volver a Favoritos
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<ComparePageProps> = async () => {
  return {
    props: { properties: allProperties },
    revalidate: 60,
  };
};
