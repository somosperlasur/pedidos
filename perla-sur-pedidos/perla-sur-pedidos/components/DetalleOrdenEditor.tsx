"use client";

import type { DetalleOrdenRow } from "@/lib/types";

function newRow(): DetalleOrdenRow {
  return {
    key: Math.random().toString(36).slice(2),
    producto: "",
    precio: 0,
    descuento: 0,
  };
}

function money(n: number): string {
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function DetalleOrdenEditor({
  rows,
  onChange,
}: {
  rows: DetalleOrdenRow[];
  onChange: (rows: DetalleOrdenRow[]) => void;
}) {
  const total = rows.reduce(
    (sum, r) => sum + (r.precio - r.descuento || 0),
    0
  );

  function updateRow(key: string, patch: Partial<DetalleOrdenRow>) {
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function removeRow(key: string) {
    onChange(rows.filter((r) => r.key !== key));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted">Detalle del pedido</span>
        <button
          type="button"
          onClick={() => onChange([...rows, newRow()])}
          className="text-xs text-orange hover:underline"
        >
          + Agregar producto
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-muted/80 italic mb-2">
          Todavía no has agregado productos.
        </p>
      ) : (
        <div className="space-y-2 mb-2">
          {rows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center"
            >
              <input
                value={row.producto}
                onChange={(e) =>
                  updateRow(row.key, { producto: e.target.value })
                }
                placeholder="Producto"
                className="rounded-md border border-border bg-surfaceRaised px-2 py-1.5 text-sm text-ink focus:border-orange"
              />
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={row.precio || ""}
                onChange={(e) =>
                  updateRow(row.key, { precio: Number(e.target.value) })
                }
                placeholder="Precio"
                className="w-24 rounded-md border border-border bg-surfaceRaised px-2 py-1.5 text-sm text-ink focus:border-orange"
              />
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={row.descuento || ""}
                onChange={(e) =>
                  updateRow(row.key, { descuento: Number(e.target.value) })
                }
                placeholder="Descuento"
                className="w-24 rounded-md border border-border bg-surfaceRaised px-2 py-1.5 text-sm text-ink focus:border-orange"
              />
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                aria-label="Quitar producto"
                className="text-muted hover:text-danger px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <p className="text-right text-sm text-ink">
          Total productos:{" "}
          <span className="font-medium">{money(total)}</span>
        </p>
      )}
    </div>
  );
}
