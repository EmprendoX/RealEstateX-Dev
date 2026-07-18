import React from "react";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import { development, availableUnitsCount, absorptionPercent, getUnitsByStatus } from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";
import { canWrite } from "@/utils/adminFileWriter";

interface Props {
  readOnly: boolean;
  lastEdited: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devJsonPath = path.join(process.cwd(), "data", "development.json");
  let readOnly = false;
  let lastEdited: string | null = null;
  try {
    readOnly = !canWrite(devJsonPath);
    const fs = await import("fs");
    if (fs.existsSync(devJsonPath)) {
      const stat = fs.statSync(devJsonPath);
      lastEdited = stat.mtime.toISOString();
    }
  } catch {
    readOnly = true;
  }
  return { props: { readOnly, lastEdited } };
};

const CARDS: Array<{ href: string; title: string; desc: string; group: string }> = [
  { href: "/admin/config", title: "Sitio & marca", desc: "Nombre, colores, tipografía, contacto, integraciones.", group: "core" },
  { href: "/admin/development", title: "Desarrollo", desc: "Nombre, tagline, copy del hero, entrega, hero images, galería.", group: "core" },
  { href: "/admin/units", title: "Unidades", desc: "Toggle rápido de estatus por unidad. Uso diario del equipo comercial.", group: "core" },
  { href: "/admin/models", title: "Modelos", desc: "Tipologías: recámaras, superficies, precios, features, planos.", group: "content" },
  { href: "/admin/gallery", title: "Galería", desc: "URLs de imágenes de la galería principal.", group: "content" },
  { href: "/admin/payment-plan", title: "Plan de pagos", desc: "Apartado, enganche, mensualidades, contra entrega, descuento contado.", group: "content" },
  { href: "/admin/investment", title: "Inversión", desc: "ADR, ocupación, gastos, plusvalía, notas de metodología.", group: "content" },
  { href: "/admin/concept", title: "Concepto", desc: "Título y descripción del proyecto, 4 highlights.", group: "content" },
  { href: "/admin/location", title: "Ubicación", desc: "Dirección, coordenadas, tiempos a lugares clave.", group: "content" },
  { href: "/admin/amenities", title: "Amenidades", desc: "Lista de amenidades con ícono y descripción.", group: "content" },
  { href: "/admin/progress", title: "Avance de obra", desc: "Hitos con fecha, estatus y notas.", group: "content" },
  { href: "/admin/developer", title: "Desarrolladora", desc: "Empresa, años, proyectos entregados, descripción.", group: "content" },
];

export default function AdminDashboard({ readOnly, lastEdited }: Props) {
  const available = availableUnitsCount(development);
  const reserved = getUnitsByStatus(development, "reserved").length;
  const sold = getUnitsByStatus(development, "sold").length;
  const total = development.units.length;
  const absorption = absorptionPercent(development);

  const availableValue = development.units
    .filter((u) => u.status === "available")
    .reduce((sum, u) => sum + u.price, 0);
  const soldValue = development.units
    .filter((u) => u.status === "sold" || u.status === "reserved")
    .reduce((sum, u) => sum + u.price, 0);

  const coreCards = CARDS.filter((c) => c.group === "core");
  const contentCards = CARDS.filter((c) => c.group === "content");

  return (
    <AdminLayout title="Dashboard" readOnly={readOnly}>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Disponibles" value={available} sub={`${total} totales`} tone="primary" />
        <Stat label="Apartadas" value={reserved} tone="amber" />
        <Stat label="Vendidas" value={sold} tone="neutral" />
        <Stat label="Colocado" value={`${absorption}%`} sub={formatCurrency(soldValue, development.currency)} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Inventario disponible</p>
          <p className="text-2xl font-semibold tabular-nums">{formatCurrency(availableValue, development.currency)}</p>
          <p className="text-xs text-neutral-500 mt-2">Suma del precio de lista de las {available} unidades disponibles.</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Última edición</p>
          <p className="text-2xl font-semibold tabular-nums">
            {lastEdited ? new Date(lastEdited).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "—"}
          </p>
          <p className="text-xs text-neutral-500 mt-2">Timestamp del último write a data/development.json.</p>
        </div>
      </div>

      {/* Core editors */}
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Uso frecuente</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {coreCards.map((c) => (
          <SectionCard key={c.href} {...c} />
        ))}
      </div>

      {/* Content editors */}
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Contenido del sitio</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contentCards.map((c) => (
          <SectionCard key={c.href} {...c} />
        ))}
      </div>
    </AdminLayout>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone: "primary" | "amber" | "neutral";
}) {
  const bg =
    tone === "primary"
      ? "bg-white border-neutral-200"
      : tone === "amber"
      ? "bg-amber-50 border-amber-200"
      : "bg-white border-neutral-200";
  const accent =
    tone === "primary" ? "text-emerald-700" : tone === "amber" ? "text-amber-800" : "text-neutral-700";
  return (
    <div className={`border rounded-lg p-5 ${bg}`}>
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">{label}</p>
      <p className={`text-3xl font-semibold tabular-nums ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-neutral-500 mt-2">{sub}</p>}
    </div>
  );
}

function SectionCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block bg-white border border-neutral-200 rounded-lg p-5 hover:border-neutral-400 hover:shadow-sm transition-all group"
    >
      <p className="font-semibold text-neutral-900 group-hover:text-neutral-950 mb-1">{title}</p>
      <p className="text-sm text-neutral-600 leading-snug">{desc}</p>
      <p className="text-xs text-neutral-400 mt-4 group-hover:text-neutral-700 transition-colors">Editar →</p>
    </Link>
  );
}
