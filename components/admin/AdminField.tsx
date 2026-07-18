"use client";

import React from "react";

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, hint, required, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium uppercase tracking-wide text-neutral-600 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-neutral-500 mt-1.5">{hint}</p>}
    </div>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${props.className ?? ""}`}
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${props.className ?? ""}`}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 border border-neutral-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 ${props.className ?? ""}`}
    />
  );
}

export function ColorInput({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  name?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        className="h-9 w-14 border border-neutral-300 rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm font-mono uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
      />
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 border-neutral-300 rounded text-neutral-900 focus:ring-2 focus:ring-neutral-900"
      />
      <span className="text-sm text-neutral-800">{label}</span>
    </label>
  );
}

export function SaveBar({
  status,
  onSave,
  onReset,
  dirty,
  message,
}: {
  status: "idle" | "saving" | "saved" | "error";
  onSave: () => void;
  onReset: () => void;
  dirty: boolean;
  message?: string | null;
}) {
  return (
    <div className="sticky bottom-0 -mx-8 mt-8 px-8 py-4 bg-white border-t border-neutral-200 flex items-center justify-between">
      <div className="text-sm">
        {status === "saved" && <span className="text-emerald-700">Guardado.</span>}
        {status === "error" && (
          <span className="text-red-700">{message || "Error al guardar."}</span>
        )}
        {status === "idle" && dirty && (
          <span className="text-amber-700">Cambios sin guardar.</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {dirty && (
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 text-sm text-neutral-700 hover:text-neutral-900"
          >
            Descartar
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || status === "saving"}
          className="px-5 py-2 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

/**
 * Editable string-list input — used for social URLs, hero images, gallery images,
 * highlights bullet points, etc. Simple add / edit / delete UX.
 */
export function StringListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  function update(i: number, v: string) {
    const next = [...value];
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...value, ""]);
  }
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-xs text-neutral-400 mt-2.5 tabular-nums w-6">
            {(i + 1).toString().padStart(2, "0")}
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-2 text-neutral-400 hover:text-red-600 text-lg"
            aria-label="Eliminar"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-xs uppercase tracking-wide text-neutral-600 hover:text-neutral-900 border border-dashed border-neutral-300 hover:border-neutral-500 px-3 py-2 rounded w-full text-left"
      >
        + Añadir
      </button>
    </div>
  );
}
