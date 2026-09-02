"use client";

import { useState, useTransition } from "react";
import type { Order, Source } from "@/lib/types";
import { SOURCES } from "@/lib/types";
import Modal from "./Modal";

export default function EditOrderModal({
  order,
  onClose,
  onSave,
  onDelete,
}: {
  order: Order;
  onClose: () => void;
  onSave: (fields: Partial<Order>) => Promise<void>;
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    startTransition(async () => {
      try {
        await onSave({
          nombre: nombre.trim(),
          source,
          celular: celular.trim() || null,
          usuario_instagram: usuario.trim() || null,
          ciudad: ciudad.trim() || null,
          direccion: direccion.trim() || null,
          numero_guia: numeroGuia.trim() || null,
          empresa_envio: empresaEnvio.trim() || null,
        });
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
        <div>
          <span className="text-sm text-muted mb-2 block">Fuente</span>
          <div className="grid grid-cols-3 gap-2">
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

        <p className="text-xs text-muted">
          Registrado por {order.owner} ·{" "}
          {new Date(order.created_at).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        {error && <p className="text-sm text-achiote">{error}</p>}

        <div className="flex items-center justify-between gap-2 pt-2">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">¿Eliminar?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md border border-achiote px-3 py-1.5 text-xs text-achiote hover:bg-achiote/10"
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
              className="text-xs text-muted hover:text-achiote"
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
              className="rounded-md bg-turmeric px-4 py-2 text-sm font-medium text-ink hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
