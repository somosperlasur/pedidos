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
          <div className="space-y-3">
            {chartRows.map((row) => (
              <div key={row.producto}>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="text-xs text-ink font-medium">
                    {row.producto}
                  </span>
                  <span className="text-[11px] text-muted shrink-0">
                    {row.unidades} unidades
                  </span>
                </div>
                <div className="w-full bg-surfaceRaised rounded h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-orange rounded flex items-center px-2 transition-all"
                    style={{
                      width: `${Math.max(
                        (row.unidades / maxUnidades) * 100,
                        10
                      )}%`,
                    }}
                  >
                    <span className="text-[11px] text-white whitespace-nowrap">
                      {money(row.ingresos)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
