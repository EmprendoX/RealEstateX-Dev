"use client";

import React, { useMemo, useState } from "react";
import type { GetServerSideProps } from "next";
import path from "path";
import AdminLayout from "@/components/admin/AdminLayout";
import { canWrite } from "@/utils/adminFileWriter";
import {
  development,
  type Unit,
  type UnitStatus,
  type DevelopmentModel,
} from "@/data/development";
import { formatCurrency } from "@/utils/formatCurrency";

interface Props {
  initial: Unit[];
  models: DevelopmentModel[];
  currency: string;
  readOnly: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const devPath = path.join(process.cwd(), "data", "development.json");
  const readOnly = !canWrite(devPath);
  return {
    props: {
      initial: development.units,
      models: development.models,
      currency: development.currency,
      readOnly,
    },
  };
};

const STATUS_OPTIONS: UnitStatus[] = ["available", "reserved", "sold"];
const STATUS_LABEL: Record<UnitStatus, string> = {
  available: "Disponible",
  reserved: "Apartada",
  sold: "Vendida",
};
const STATUS_COLOR: Record<UnitStatus, string> = {
  available: "bg-emerald-100 text-emerald-800",
  reserved: "bg-amber-100 text-amber-800",
  sold: "bg-neutral-200 text-neutral-600",
};

type Filter = "all" | UnitStatus;

export default function AdminUnitsPage({ initial, models, currency, readOnly }: Props) {
  const [units, setUnits] = useState<Unit[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [errorId, setErrorId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (filter !== "all" && u.status !== filter) return false;
      if (modelFilter !== "all" && u.modelId !== modelFilter) return false;
      return true;
    });
  }, [units, filter, modelFilter]);

  const counts = useMemo(() => {
    const c = { available: 0, reserved: 0, sold: 0 };
    units.forEach((u) => (c[u.status] += 1));
    return c;
  }, [units]);

  function modelName(id: string) {
    return models.find((m) => m.id === id)?.name.es ?? id;
  }

  async function updateStatus(unitId: string, status: UnitStatus) {
    // Optimistic update
    const previous = units.find((u) => u.id === unitId)?.status;
    setUnits((prev) => prev.map((u) => (u.id === unitId ? { ...u, status } : u)));
    setPendingIds((prev) => new Set(prev).add(unitId));
    setErrorId(null);

    try {
      const res = await fetch("/api/admin/units", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, patch: { status } }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "PATCH failed");
    } catch {
      // Revert on failure
      setUnits((prev) =>
        prev.map((u) => (u.id === unitId && previous ? { ...u, status: previous } : u))
      );
      setErrorId(unitId);
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(unitId);
        return next;
      });
    }
  }

  return (
    <AdminLayout title="Unidades" readOnly={readOnly}>
      <div className="max-w-6xl">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <FilterCard
            label="Disponibles"
            count={counts.available}
            active={filter === "available"}
            onClick={() => setFilter(filter === "available" ? "all" : "available")}
            tone="emerald"
          />
          <FilterCard
            label="Apartadas"
            count={counts.reserved}
            active={filter === "reserved"}
            onClick={() => setFilter(filter === "reserved" ? "all" : "reserved")}
            tone="amber"
          />
          <FilterCard
            label="Vendidas"
            count={counts.sold}
            active={filter === "sold"}
            onClick={() => setFilter(filter === "sold" ? "all" : "sold")}
            tone="neutral"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 uppercase tracking-wide">Modelo:</span>
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="px-3 py-1.5 border border-neutral-300 rounded text-sm bg-white"
            >
              <option value="all">Todos</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.es}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-neutral-500">
            Cambio de estatus se guarda automáticamente al seleccionar.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="text-left px-4 py-3">Unidad</th>
                <th className="text-left px-4 py-3">Modelo</th>
                <th className="text-left px-4 py-3">Nivel</th>
                <th className="text-left px-4 py-3">Orientación</th>
                <th className="text-right px-4 py-3">Área</th>
                <th className="text-right px-4 py-3">Precio</th>
                <th className="text-left px-4 py-3">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 text-sm">
                    Ningún unidad con estos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className={errorId === u.id ? "bg-red-50" : "hover:bg-neutral-50"}
                  >
                    <td className="px-4 py-3 font-semibold">{u.id}</td>
                    <td className="px-4 py-3 text-neutral-700">{modelName(u.modelId)}</td>
                    <td className="px-4 py-3 tabular-nums">{u.level}</td>
                    <td className="px-4 py-3 text-neutral-600 text-xs">
                      {u.orientation?.es ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{u.area} m²</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrency(u.price, currency as any)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.status}
                          onChange={(e) => updateStatus(u.id, e.target.value as UnitStatus)}
                          disabled={pendingIds.has(u.id) || readOnly}
                          className={`px-2.5 py-1 rounded text-xs font-medium border-0 focus:ring-2 focus:ring-neutral-900 disabled:opacity-60 ${STATUS_COLOR[u.status]}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                        {pendingIds.has(u.id) && (
                          <span className="text-xs text-neutral-400">guardando…</span>
                        )}
                        {errorId === u.id && (
                          <span className="text-xs text-red-600">error, se revirtió</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-neutral-500 mt-4">
          Para agregar o eliminar unidades, edita <code className="px-1 bg-neutral-100 rounded">data/development.json</code> directamente y recarga.
          El editor visual completo llega en el próximo release.
        </p>
      </div>
    </AdminLayout>
  );
}

function FilterCard({
  label,
  count,
  active,
  onClick,
  tone,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  tone: "emerald" | "amber" | "neutral";
}) {
  const activeCls =
    tone === "emerald"
      ? "border-emerald-500 bg-emerald-50"
      : tone === "amber"
      ? "border-amber-500 bg-amber-50"
      : "border-neutral-500 bg-neutral-100";
  const numCls =
    tone === "emerald" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-neutral-700";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border rounded-lg p-4 transition-all ${
        active ? activeCls : "border-neutral-200 bg-white hover:border-neutral-300"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">{label}</p>
      <p className={`text-3xl font-semibold tabular-nums ${numCls}`}>{count}</p>
    </button>
  );
}
