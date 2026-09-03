"use client";

import { useState, useTransition } from "react";
import type { DetalleOrdenRow, MetodoPago, Order, Stage } from "@/lib/types";
import { METODOS_PAGO } from "@/lib/types";
import Modal from "./Modal";
import DetalleOrdenEditor from "./DetalleOrdenEditor";

const TITLES: Record<Stage, string> = {
  preguntar: "Procesando",
  realizado: "Realizado",
  enviado: "Enviado",
};

export default function StageFieldsModal({
  order,
  targetStage,
  initialDetalleRows,
  onClose,
  onConfirm,
}: {
  order: Order;
  targetStage: Stage;
  initialDetalleRows: DetalleOrdenRow[];
  onClose: () => void;
  onConfirm: (
    fields: Record<string, string | number>,
    detalleRows?: DetalleOrdenRow[]
  ) => Promise<void>;
}) {
  const [ciudad, setCiudad] = useState(order.ciudad ?? "");
  const [direccion, setDireccion] = useState(order.direccion ?? "");
  const [costoTotal, setCostoTotal] = useState(
    order.costo_total != null ? String(order.costo_total) : ""
  );
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(
    order.metodo_pago
  );
  const [detalleRows, setDetalleRows] =
    useState<DetalleOrdenRow[]>(initialDetalleRows);
  const [numeroGuia, setNumeroGuia] = useState(order.numero_guia ?? "");
  const [empresaEnvio, setEmpresaEnvio] = useState(order.empresa_envio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let fields: Record<string, string | number> = {};
    let rowsToSave: DetalleOrdenRow[] | undefined;

    if (targetStage === "realizado") {
      if (!ciudad.trim() || !direccion.trim()) {
        setError("Ciudad y dirección son obligatorias.");
        return;
      }
      if (!costoTotal.trim() || Number(costoTotal) <= 0) {
        setError("El costo total es obligatorio.");
        return;
      }
      if (!metodoPago) {
        setError("Selecciona un método de pago.");
        return;
      }
      const validRows = detalleRows.filter((r) => r.producto.trim());
      if (validRows.length === 0) {
        setError("Agrega al menos un producto en el detalle del pedido.");
        return;
      }
      fields = {
        ciudad: ciudad.trim(),
        direccion: direccion.trim(),
        costo_total: Number(costoTotal),
        metodo_pago: metodoPago,
      };
      rowsToSave = validRows;
    }

    if (targetStage === "enviado") {
      if (!numeroGuia.trim() || !empresaEnvio.trim()) {
        setError("Número de guía y empresa de envío son obligatorios.");
        return;
      }
      fields = {
        numero_guia: numeroGuia.trim(),
        empresa_envio: empresaEnvio.trim(),
      };
    }

    startTransition(async () => {
      try {
        await onConfirm(fields, rowsToSave);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo salió mal.");
      }
    });
  }

  return (
    <Modal title={`Mover a: ${TITLES[targetStage]}`} onClose={onClose}>
      <p className="mb-4 text-sm text-muted">
        Pedido de <span className="text-cream">{order.nombre}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {targetStage === "realizado" && (
          <>
            <label className="block">
              <span className="text-sm text-muted mb-2 block">Ciudad</span>
              <input
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted mb-2 block">Dirección</span>
              <input
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted mb-2 block">
                Costo total
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={costoTotal}
                onChange={(e) => setCostoTotal(e.target.value)}
                className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
                placeholder="0"
              />
            </label>

            <div>
              <span className="text-sm text-muted mb-2 block">
                Método de pago
              </span>
              <div className="grid grid-cols-2 gap-2">
                {METODOS_PAGO.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMetodoPago(m.id)}
                    className={`rounded-md border py-2 text-sm transition-colors ${
                      metodoPago === m.id
                        ? "border-turmeric text-turmeric bg-turmeric/10"
                        : "border-border text-muted bg-surfaceRaised"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-surfaceRaised p-3">
              <DetalleOrdenEditor rows={detalleRows} onChange={setDetalleRows} />
            </div>
          </>
        )}

        {targetStage === "enviado" && (
          <>
            <label className="block">
              <span className="text-sm text-muted mb-2 block">
                Empresa de envío
              </span>
              <input
                value={empresaEnvio}
                onChange={(e) => setEmpresaEnvio(e.target.value)}
                className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
                placeholder="Servientrega, Interrapidísimo…"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted mb-2 block">
                Número de guía
              </span>
              <input
                value={numeroGuia}
                onChange={(e) => setNumeroGuia(e.target.value)}
                className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
              />
            </label>
          </>
        )}

        {targetStage === "preguntar" && (
          <p className="text-sm text-muted">
            Se moverá de vuelta a &ldquo;Procesando&rdquo;, sin perder los
            datos ya guardados.
          </p>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm text-muted hover:text-cream"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-turmeric px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Moviendo…" : "Mover pedido"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
