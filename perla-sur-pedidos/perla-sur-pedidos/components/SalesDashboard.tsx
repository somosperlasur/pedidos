"use client";

import type { DetalleOrdenItem, Order } from "@/lib/types";

function money(n: number): string {
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export default function SalesDashboard({
  orders,
  detalleByOrder,
}: {
  orders: Order[];
  detalleByOrder: Record<string, DetalleOrdenItem[]>;
}) {
  let ingresosTotales = 0;
  let descuentosTotales = 0;
  let ingresosPendientes = 0;
  const porProducto: Record<string, { unidades: number; ingresos: number }> =
    {};

  for (const order of orders) {
    const items = detalleByOrder[order.id] ?? [];
    for (const item of items) {
      descuentosTotales += item.descuento || 0;

      if (order.pago_confirmado) {
        ingresosTotales += item.total_producto || 0;
      } else {
        ingresosPendientes += item.total_producto || 0;
      }

      if (order.pago_confirmado && order.stage === "enviado") {
        const entry = porProducto[item.producto] ?? {
          unidades: 0,
          ingresos: 0,
        };
        entry.unidades += item.unidades || 0;
        entry.ingresos += item.total_producto || 0;
        porProducto[item.producto] = entry;
      }
    }
  }

  const chartRows = Object.entries(porProducto)
    .map(([producto, v]) => ({ producto, ...v }))
    .sort((a, b) => b.unidades - a.unidades);

  const maxUnidades = Math.max(1, ...chartRows.map((r) => r.unidades));

  return (
    <div className="px-6 pt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted mb-1">Ingresos Totales (Pago ✓)</p>
          <p className="text-xl font-semibold text-orange">
            {money(ingresosTotales)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted mb-1">Descuentos Totales</p>
          <p className="text-xl font-semibold text-teal">
            {money(descuentosTotales)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted mb-1">Ingresos Pendientes</p>
          <p className="text-xl font-semibold text-forest">
            {money(ingresosPendientes)}
          </p>
        </div>
      </div>

      {chartRows.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-4 mb-4">
          <p className="text-sm text-muted mb-3">
            Unidades vendidas por producto{" "}
            <span className="text-muted/70">(pagado y enviado)</span>
          </p>
          <div className="space-y-2">
            {chartRows.map((row) => (
              <div key={row.producto} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-xs text-ink truncate">
                  {row.producto}
                </span>
                <div className="flex-1 bg-surfaceRaised rounded h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-orange rounded flex items-center px-2 transition-all"
                    style={{
                      width: `${Math.max(
                        (row.unidades / maxUnidades) * 100,
                        6
                      )}%`,
                    }}
                  >
                    <span className="text-[11px] text-white whitespace-nowrap">
                      {money(row.ingresos)}
                    </span>
                  </div>
                </div>
                <span className="w-12 shrink-0 text-xs text-muted text-right">
                  {row.unidades}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
