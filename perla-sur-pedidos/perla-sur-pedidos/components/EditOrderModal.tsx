"use client";

import { useState, useTransition } from "react";
import type { DetalleOrdenRow, MetodoPago, Order, Source } from "@/lib/types";
import { METODOS_PAGO, SOURCES, STAGES } from "@/lib/types";
import Modal from "./Modal";
import DetalleOrdenEditor from "./DetalleOrdenEditor";

export default function EditOrderModal({
  order,
  initialDetalleRows,
  onClose,
  onSave,
  onDelete,
}: {
  order: Order;
  initialDetalleRows: DetalleOrdenRow[];
  onClose: () => void;
  onSave: (
    fields: Partial<Order>,
    detalleRows: DetalleOrdenRow[]
  ) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [nombre, setNombre] = useState(order.nombre);
  const [source, setSource] = useState<Source>(order.source);
  const [celular, setCelular] = useState(order.celular ?? "");
  const [usuario, setUsuario] = useState(order.usuario_instagram ?? "");
  const [ciudad, setCiudad] = useState(order.ciudad ?? "");
  const [direccion, setDireccion] = useState(order.direccion ?? "");
  const [numeroGuia, setNumeroGuia] = useState(order.numero_guia ?? "");
  const [empresaEnvio, setEmpresaEnvio] = useState(order.empresa_envio ?? "");
  const [costoTotal, setCostoTotal] = useState(
    order.costo_total != null ? String(order.costo_total) : ""
  );
  const [pagoConfirmado, setPagoConfirmado] = useState(order.pago_confirmado);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(
    order.metodo_pago
  );
  const [detalleRows, setDetalleRows] =
    useState<DetalleOrdenRow[]>(initialDetalleRows);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const stageLabel =
    STAGES.find((s) => s.id === order.stage)?.label ?? order.stage;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    startTransition(async () => {
      try {
        await onSave(
          {
            nombre: nombre.trim(),
            source,
            celular: celular.trim() || null,
            usuario_instagram: usuario.trim() || null,
            ciudad: ciudad.trim() || null,
            direccion: direccion.trim() || null,
            numero_guia: numeroGuia.trim() || null,
            empresa_envio: empresaEnvio.trim() || null,
            costo_total: costoTotal.trim() ? Number(costoTotal) : null,
            pago_confirmado: pagoConfirmado,
            metodo_pago: metodoPago,
          },
          detalleRows.filter((r) => r.producto.trim())
        );
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo salió mal.");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await onDelete();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo salió mal.");
      }
    });
  }

  return (
    <Modal title="Detalle del pedido" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between rounded-md border border-border bg-surfaceRaised px-3 py-2">
          <span className="text-sm text-muted">
            Orden{" "}
            <span className="font-medium text-cream">
              #{order.numero_orden}
            </span>
          </span>
          <span className="text-xs rounded-full border border-orange/40 bg-orange/10 px-2 py-0.5 text-orange">
            {stageLabel}
          </span>
        </div>

        <div>
          <span className="text-sm text-muted mb-2 block">Fuente</span>
          <div className="grid grid-cols-2 gap-2">
            {SOURCES.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setSource(s.id)}
                className={`rounded-md border py-2 text-sm transition-colors ${
                  source === s.id
                    ? "border-turmeric text-turmeric bg-turmeric/10"
                    : "border-border text-muted bg-surfaceRaised"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-sm text-muted mb-2 block">Nombre</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted mb-2 block">Celular</span>
            <input
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted mb-2 block">Usuario IG</span>
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted mb-2 block">Ciudad</span>
            <input
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-muted mb-2 block">
              Empresa de envío
            </span>
            <input
              value={empresaEnvio}
              onChange={(e) => setEmpresaEnvio(e.target.value)}
              className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
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
        </div>

        <div className="grid grid-cols-2 gap-3 items-end">
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
          <label className="flex items-center gap-2 pb-2.5">
            <input
              type="checkbox"
              checked={pagoConfirmado}
              onChange={(e) => setPagoConfirmado(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-orange"
            />
            <span className="text-sm text-cream">Pago confirmado</span>
          </label>
        </div>

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

        <p className="text-xs text-muted">
          Registrado por {order.owner} ·{" "}
          {new Date(order.created_at).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex items-center justify-between gap-2 pt-2">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">¿Eliminar?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md border border-danger px-3 py-1.5 text-xs text-danger hover:bg-danger/10"
              >
                Sí, eliminar
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-muted hover:text-cream"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-muted hover:text-danger"
            >
              Eliminar pedido
            </button>
          )}

          <div className="flex gap-2">
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
              {isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
