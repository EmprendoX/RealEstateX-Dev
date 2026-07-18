"use client";

import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import { Field, TextInput, TextArea, Select, ColorInput, Checkbox, SaveBar } from "@/components/admin/AdminField";
import { canWrite } from "@/utils/adminFileWriter";
import { siteConfig, type SiteConfig } from "@/config/siteConfig";

interface Props {
  initial: SiteConfig;
  readOnly: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const configPath = path.join(process.cwd(), "config", "siteConfig.json");
  const readOnly = !canWrite(configPath);
  return { props: { initial: siteConfig, readOnly } };
};

type Status = "idle" | "saving" | "saved" | "error";

export default function AdminConfigPage({ initial, readOnly }: Props) {
  const [form, setForm] = useState<SiteConfig>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  function update<K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Error al guardar");
        return;
      }
      setStatus("saved");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.message || "Error de red");
    }
  }

  function reset() {
    setForm(initial);
    setStatus("idle");
  }

  return (
    <AdminLayout title="Sitio & marca" readOnly={readOnly}>
      <div className="max-w-3xl space-y-10">
        <Group title="Identidad">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Nombre del sitio" required>
              <TextInput value={form.siteName} onChange={(e) => update("siteName", e.target.value)} />
            </Field>
            <Field label="URL de producción" required hint="Sin barra final. Ej: https://cardon.mx">
              <TextInput value={form.siteUrl} onChange={(e) => update("siteUrl", e.target.value)} />
            </Field>
            <Field label="Logo (texto)" required hint="Wordmark si no usás imagen de logo.">
              <TextInput value={form.logoText} onChange={(e) => update("logoText", e.target.value)} />
            </Field>
            <Field label="Logo (URL de imagen)" hint="Opcional. Reemplaza el wordmark si está seteado.">
              <TextInput value={form.logoUrl ?? ""} onChange={(e) => update("logoUrl", e.target.value)} placeholder="https://…" />
            </Field>
          </div>
        </Group>

        <Group title="Contacto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Teléfono visible" required>
              <TextInput value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </Field>
            <Field label="WhatsApp (sólo dígitos)" required hint="Con código de país sin +. Ej: 5216241458200">
              <TextInput value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
            </Field>
            <Field label="Email" required hint="A donde llegan los leads.">
              <TextInput type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </Field>
            <Field label="Dirección de oficina">
              <TextInput value={form.officeAddress ?? ""} onChange={(e) => update("officeAddress", e.target.value)} />
            </Field>
          </div>
        </Group>

        <Group title="Paleta">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Color primario" required hint="Acentos principales, botones activos.">
              <ColorInput value={form.primaryColor} onChange={(v) => update("primaryColor", v)} />
            </Field>
            <Field label="Color de acento" required hint="Segundo acento (arena / cobre / cactus).">
              <ColorInput value={form.accentColor} onChange={(v) => update("accentColor", v)} />
            </Field>
            <Field label="Ink (texto oscuro)" required>
              <ColorInput value={form.inkColor} onChange={(v) => update("inkColor", v)} />
            </Field>
            <Field label="Surface (fondo base)" required>
              <ColorInput value={form.surfaceColor} onChange={(v) => update("surfaceColor", v)} />
            </Field>
          </div>
        </Group>

        <Group title="Tipografía">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Tipografía display" required hint="Titulares, wordmark, números grandes.">
              <Select
                value={form.displayFont}
                onChange={(e) => update("displayFont", e.target.value as SiteConfig["displayFont"])}
              >
                <option value="fraunces">Fraunces</option>
                <option value="cormorant">Cormorant Garamond</option>
                <option value="playfair">Playfair Display</option>
              </Select>
            </Field>
            <Field label="Tipografía body" required hint="Párrafos, labels, botones.">
              <Select
                value={form.bodyFont}
                onChange={(e) => update("bodyFont", e.target.value as SiteConfig["bodyFont"])}
              >
                <option value="inter">Inter</option>
                <option value="manrope">Manrope</option>
              </Select>
            </Field>
          </div>
        </Group>

        <Group title="Desarrolladora">
          <Field label="Nombre corto" required hint="Aparece en footer y en TrustStrip. La descripción larga vive en el editor de Desarrolladora.">
            <TextInput value={form.developerCompany} onChange={(e) => update("developerCompany", e.target.value)} />
          </Field>
        </Group>

        <Group title="Redes sociales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Instagram">
              <TextInput value={form.instagram ?? ""} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/…" />
            </Field>
            <Field label="Facebook">
              <TextInput value={form.facebook ?? ""} onChange={(e) => update("facebook", e.target.value)} placeholder="https://facebook.com/…" />
            </Field>
            <Field label="TikTok">
              <TextInput value={form.tiktok ?? ""} onChange={(e) => update("tiktok", e.target.value)} placeholder="https://tiktok.com/@…" />
            </Field>
            <Field label="LinkedIn">
              <TextInput value={form.linkedin ?? ""} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/…" />
            </Field>
            <Field label="Website corporativo">
              <TextInput value={form.website ?? ""} onChange={(e) => update("website", e.target.value)} placeholder="https://…" />
            </Field>
          </div>
        </Group>

        <Group title="Integraciones">
          <div className="space-y-5">
            <Field label="Webhook de leads (Make, Zapier, HubSpot…)" hint="Cada lead se POSTea a esta URL además del email por Resend.">
              <TextInput value={form.leadWebhookUrl ?? ""} onChange={(e) => update("leadWebhookUrl", e.target.value)} placeholder="https://hook.eu2.make.com/…" />
            </Field>
            <Field label="Script de chat widget" hint="HTML/JS que se inyecta en cada página. Crisp, Intercom, Tidio, etc.">
              <TextArea rows={4} value={form.chatScript ?? ""} onChange={(e) => update("chatScript", e.target.value)} placeholder='<script>…</script>' />
            </Field>
            <Field label="">
              <Checkbox
                checked={!!form.brochureRequiresLead}
                onChange={(v) => update("brochureRequiresLead", v)}
                label="Requerir captura de lead antes de mostrar el brochure PDF"
              />
            </Field>
          </div>
        </Group>
      </div>

      <SaveBar status={status} onSave={save} onReset={reset} dirty={dirty} message={errorMessage} />
    </AdminLayout>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4 pb-2 border-b border-neutral-200">
        {title}
      </h2>
      {children}
    </section>
  );
}
