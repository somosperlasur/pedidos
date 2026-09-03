"use client";

import type { DetalleOrdenRow } from "@/lib/types";

function newRow(): DetalleOrdenRow {
  return {
    key: Math.random().toString(36).slice(2),
    producto: "",
    unidades: 1,
    costo_unitario: 0,
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
    (sum, r) => sum + ((r.unidades || 0) * r.costo_unitario - r.descuento || 0),
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
          {rows.map((row) => {
            const rowTotal =
              (row.unidades || 0) * row.costo_unitario - row.descuento;
            return (
              <div key={row.key} className="space-y-1">
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <input
                    value={row.producto}
                    onChange={(e) =>
                      updateRow(row.key, { producto: e.target.value })
                    }
                    placeholder="Producto"
                    className="rounded-md border border-border bg-surfaceRaised px-2 py-1.5 text-sm text-ink focus:border-orange"
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
                <div className="grid grid-cols-3 gap-2">
                  <label className="block">
                    <span className="text-[10px] text-muted">Unidades</span>
                    <input
                      type="number"
