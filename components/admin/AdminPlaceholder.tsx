"use client";

import React from "react";

/**
 * Stub for admin sections whose full editor lands in a follow-up push.
 * Points the user to the source-of-truth JSON, shows current count so
 * they know the data isn't empty, and links back to the public section
 * so they can jump to see their edits render.
 */
export default function AdminPlaceholder({
  title,
  count,
  countLabel,
  jsonPath,
  jsonKey,
  publicAnchor,
  publicLabel,
  extra,
}: {
  title: string;
  count?: number;
  countLabel?: string;
  jsonPath?: string;
  jsonKey?: string;
  publicAnchor?: string;
  publicLabel?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-neutral-200 rounded-lg p-8">
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
          Editor visual en desarrollo
        </p>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-sm text-neutral-700 leading-relaxed mb-6">
          El editor visual para esta sección llega en el próximo release. Por ahora, editá el JSON
          directamente y recargá el sitio — los cambios se reflejan en dev inmediatamente.
        </p>

        <div className="space-y-4 border-t border-neutral-100 pt-6">
          {jsonPath && (
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Archivo</p>
              <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded inline-block">
                {jsonPath}
              </code>
              {jsonKey && (
                <>
                  <span className="text-sm text-neutral-500 mx-2">→</span>
                  <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded inline-block">
                    {jsonKey}
                  </code>
                </>
              )}
            </div>
          )}

          {count !== undefined && countLabel && (
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Estado actual</p>
              <p className="text-sm text-neutral-800">
                <span className="font-semibold tabular-nums">{count}</span> {countLabel}
              </p>
            </div>
          )}

          {extra && <div className="text-sm text-neutral-700">{extra}</div>}

          {publicAnchor && (
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Ver en el sitio</p>
              <a
                href={publicAnchor}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-900 underline hover:no-underline"
              >
                {publicLabel || publicAnchor} ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
