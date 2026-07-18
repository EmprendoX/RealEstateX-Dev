"use client";

import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import { Field, TextInput, TextArea, Select, SaveBar, StringListInput } from "@/components/admin/AdminField";
import { canWrite } from "@/utils/adminFileWriter";
import { development, type Development } from "@/data/development";

// Editable subset of Development (top-level fields only — nested subtrees
// have their own editors).
type EditableFields =
  | "slug"
  | "name"
  | "tagline"
  | "heroHeadline"
  | "heroPoints"
  | "intro"
  | "currency"
  | "status"
  | "deliveryDate"
  | "totalUnits"
  | "heroImages"
  | "heroVideoUrl"
  | "galleryImages"
  | "virtualTourUrl"
  | "virtualTourProvider"
  | "brochureUrl";

type EditForm = Pick<Development, EditableFields>;

interface Props {
  initial: EditForm;
  readOnly: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  const readOnly = !canWrite(devPath);
  const raw = {
    slug: development.slug,
    name: development.name,
    tagline: development.tagline,
    heroHeadline: development.heroHeadline,
    heroPoints: development.heroPoints,
    intro: development.intro,
    currency: development.currency,
    status: development.status,
    deliveryDate: development.deliveryDate,
    totalUnits: development.totalUnits,
    heroImages: development.heroImages,
    heroVideoUrl: development.heroVideoUrl,
    galleryImages: development.galleryImages,
    virtualTourUrl: development.virtualTourUrl,
    virtualTourProvider: development.virtualTourProvider,
    brochureUrl: development.brochureUrl,
  };
  // Strip undefined optionals — Next.js requires JSON-serializable props.
  const initial = JSON.parse(JSON.stringify(raw)) as EditForm;
  return { props: { initial, readOnly } };
};

type Status = "idle" | "saving" | "saved" | "error";

export default function AdminDevelopmentPage({ initial, readOnly }: Props) {
  const [form, setForm] = useState<EditForm>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  function update<K extends keyof EditForm>(k: K, v: EditForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setStatus("idle");
  }

  function updateI18n(
    k: "tagline" | "heroHeadline" | "intro",
    lang: "es" | "en",
    v: string
  ) {
    update(k, { ...form[k], [lang]: v } as any);
  }

  function updateI18nList(k: "heroPoints", lang: "es" | "en", v: string[]) {
    update(k, { ...form[k], [lang]: v } as any);
  }

  async function save() {
    setStatus("saving");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/development", {
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
    <AdminLayout title="Desarrollo" readOnly={readOnly}>
      <div className="max-w-3xl space-y-10">
        <Group title="Identidad del proyecto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Nombre" required>
              <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} />
            </Field>
            <Field label="Slug" hint="Se usa en URLs y en el nombre del brochure PDF.">
              <TextInput value={form.slug} onChange={(e) => update("slug", e.target.value)} />
            </Field>
            <Field label="Total de unidades" required>
              <TextInput
                type="number"
                value={form.totalUnits}
                onChange={(e) => update("totalUnits", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Fecha de entrega" required hint="Formato YYYY-MM. Ej: 2028-01">
              <TextInput
                value={form.deliveryDate}
                onChange={(e) => update("deliveryDate", e.target.value)}
                placeholder="2028-01"
              />
            </Field>
            <Field label="Moneda" required>
              <Select
                value={form.currency}
                onChange={(e) => update("currency", e.target.value as "USD" | "MXN")}
              >
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
              </Select>
            </Field>
            <Field label="Etapa del proyecto" required>
              <Select
                value={form.status}
                onChange={(e) => update("status", e.target.value as EditForm["status"])}
              >
                <option value="preventa">Preventa</option>
                <option value="construccion">En construcción</option>
                <option value="entrega">En entrega</option>
                <option value="entregado">Entregado</option>
              </Select>
            </Field>
          </div>
        </Group>

        <Group title="Copy del hero">
          <div className="space-y-5">
            <I18nField
              label="Tagline"
              hint="Frase corta debajo del H1 en el hero."
              value={form.tagline}
              onChange={(lang, v) => updateI18n("tagline", lang, v)}
              multiline
            />
            <I18nField
              label="Título principal (H1 del hero)"
              hint="La oración larga descriptiva del proyecto."
              value={form.heroHeadline}
              onChange={(lang, v) => updateI18n("heroHeadline", lang, v)}
              multiline
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Puntos del hero (español)" hint="Aparecen con separador · debajo del H1.">
                <StringListInput
                  value={form.heroPoints.es}
                  onChange={(v) => updateI18nList("heroPoints", "es", v)}
                  placeholder="Ej: Arquitectura contemporánea"
                />
              </Field>
              <Field label="Puntos del hero (inglés)">
                <StringListInput
                  value={form.heroPoints.en}
                  onChange={(v) => updateI18nList("heroPoints", "en", v)}
                  placeholder="Eg: Contemporary architecture"
                />
              </Field>
            </div>
            <I18nField
              label="Intro (metadescripción del sitio)"
              hint="Párrafo largo — se usa como og:description, meta description y en el brochure PDF."
              value={form.intro}
              onChange={(lang, v) => updateI18n("intro", lang, v)}
              multiline
              rows={4}
            />
          </div>
        </Group>

        <Group title="Imágenes del hero">
          <Field
            label="URLs de imágenes del hero"
            hint="Se hacen crossfade cada 8 segundos. Recomendado: 2400px de ancho, formato horizontal 16:9 o 4:3."
          >
            <StringListInput
              value={form.heroImages}
              onChange={(v) => update("heroImages", v)}
              placeholder="https://…"
            />
          </Field>
          <Field
            label="Video del hero (opcional)"
            hint="MP4 público. Si está seteado, reemplaza el crossfade de imágenes con un video autoplay muted loop."
            className="mt-5"
          >
            <TextInput
              value={form.heroVideoUrl ?? ""}
              onChange={(e) => update("heroVideoUrl", e.target.value)}
              placeholder="https://videos.pexels.com/…"
            />
          </Field>
        </Group>

        <Group title="Galería">
          <Field label="URLs de imágenes" hint="Se muestran en la sección de Galería con lightbox. Recomendado: 1600px de ancho.">
            <StringListInput
              value={form.galleryImages}
              onChange={(v) => update("galleryImages", v)}
              placeholder="https://…"
            />
          </Field>
        </Group>

        <Group title="Tour virtual">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="URL del tour" hint="Matterport, YouTube o Vimeo." className="md:col-span-2">
              <TextInput
                value={form.virtualTourUrl ?? ""}
                onChange={(e) => update("virtualTourUrl", e.target.value)}
                placeholder="https://my.matterport.com/show/?m=…"
              />
            </Field>
            <Field label="Proveedor" hint="Se auto-detecta si dejás en blanco.">
              <Select
                value={form.virtualTourProvider ?? ""}
                onChange={(e) => update("virtualTourProvider", (e.target.value || undefined) as any)}
              >
                <option value="">Auto-detectar</option>
                <option value="matterport">Matterport</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="generic">Genérico (iframe)</option>
              </Select>
            </Field>
          </div>
        </Group>

        <Group title="Brochure (adjunto externo)">
          <Field
            label="URL de brochure PDF externo (opcional)"
            hint="Si querés servir tu propio PDF en lugar del auto-generado por /api/brochure, pegá aquí la URL."
          >
            <TextInput
              value={form.brochureUrl ?? ""}
              onChange={(e) => update("brochureUrl", e.target.value)}
              placeholder="https://…/brochure.pdf"
            />
          </Field>
        </Group>
      </div>

      <SaveBar status={status} onSave={save} onReset={reset} dirty={dirty} message={errorMessage} />
    </AdminLayout>
  );
}

function I18nField({
  label,
  hint,
  value,
  onChange,
  multiline,
  rows,
}: {
  label: string;
  hint?: string;
  value: { es: string; en: string };
  onChange: (lang: "es" | "en", v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-neutral-600">{label}</label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <LangInput lang="ES" value={value.es} onChange={(v) => onChange("es", v)} multiline={multiline} rows={rows} />
        <LangInput lang="EN" value={value.en} onChange={(v) => onChange("en", v)} multiline={multiline} rows={rows} />
      </div>
      {hint && <p className="text-xs text-neutral-500 mt-1.5">{hint}</p>}
    </div>
  );
}

function LangInput({
  lang,
  value,
  onChange,
  multiline,
  rows,
}: {
  lang: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="relative">
      <span className="absolute top-2 left-3 text-[10px] font-mono uppercase text-neutral-400 pointer-events-none">
        {lang}
      </span>
      {multiline ? (
        <TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows ?? 2}
          className="pt-6"
        />
      ) : (
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pt-5"
        />
      )}
    </div>
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
