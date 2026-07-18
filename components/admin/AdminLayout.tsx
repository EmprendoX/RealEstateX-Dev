"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { siteConfig } from "@/config/siteConfig";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  readOnly?: boolean;
}

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/config", label: "Sitio & marca" },
  { href: "/admin/development", label: "Desarrollo" },
  { href: "/admin/units", label: "Unidades" },
  { href: "/admin/models", label: "Modelos" },
  { href: "/admin/gallery", label: "Galería" },
  { href: "/admin/payment-plan", label: "Plan de pagos" },
  { href: "/admin/investment", label: "Inversión" },
  { href: "/admin/concept", label: "Concepto" },
  { href: "/admin/location", label: "Ubicación" },
  { href: "/admin/amenities", label: "Amenidades" },
  { href: "/admin/progress", label: "Avance de obra" },
  { href: "/admin/developer", label: "Desarrolladora" },
];

export default function AdminLayout({ children, title, readOnly = false }: AdminLayoutProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/check-auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          setAuthed(true);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setChecking(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-sm text-neutral-500 tracking-wide">Verificando sesión…</p>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <>
      <Head>
        <title>{`${title} · Admin — ${siteConfig.siteName}`}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-neutral-50 text-neutral-900 flex">
        <aside className="w-60 bg-neutral-950 text-white flex flex-col fixed inset-y-0 left-0 z-10">
          <div className="px-6 py-5 border-b border-white/10">
            <Link href="/admin" className="block">
              <p className="text-[10px] uppercase tracking-widest text-white/50">Admin</p>
              <p className="font-semibold text-lg">{siteConfig.siteName}</p>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-0.5 px-3">
              {NAV.map((item) => {
                const active =
                  item.href === "/admin"
                    ? router.pathname === "/admin"
                    : router.pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded text-sm transition-colors ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="px-3 py-4 border-t border-white/10 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="block px-3 py-2 rounded text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              Ver sitio ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex-1 pl-60">
          {readOnly && (
            <div className="bg-amber-100 border-b border-amber-300 px-8 py-2 text-xs text-amber-900">
              Modo lectura: el sistema de archivos es de sólo lectura en este entorno. Los cambios que hagas acá no van a persistir.
              Este admin sólo escribe en dev local.
            </div>
          )}

          <header className="border-b border-neutral-200 bg-white">
            <div className="px-8 py-5">
              <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
            </div>
          </header>

          <main className="px-8 py-8">{children}</main>
        </div>
      </div>
    </>
  );
}
