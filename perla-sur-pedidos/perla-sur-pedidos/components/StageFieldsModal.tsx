"use client";

import { useState, useTransition } from "react";
import type { Order, Stage } from "@/lib/types";
import Modal from "./Modal";

const TITLES: Record<Stage, string> = {
  preguntar: "Escribieron a preguntar",
  realizado: "Pedido realizado",
  enviado: "Pedido enviado",
};

export default function StageFieldsModal({
  order,
  targetStage,
  onClose,
  onConfirm,
}: {
  order: Order;
  targetStage: Stage;
  onClose: () => void;
  onConfirm: (fields: Record<string, string>) => Promise<void>;
}) {
  const [ciudad, setCiudad] = useState(order.ciudad ?? "");
  const [direccion, setDireccion] = useState(order.direccion ?? "");
  const [numeroGuia, setNumeroGuia] = useState(order.numero_guia ?? "");
  const [empresaEnvio, setEmpresaEnvio] = useState(order.empresa_envio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let fields: Record<string, string> = {};

    if (targetStage === "realizado") {
      if (!ciudad.trim() || !direccion.trim()) {
        setError("Ciudad y dirección son obligatorias.");
        return;
      }
      fields = { ciudad: ciudad.trim(), direccion: direccion.trim() };
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
        await onConfirm(fields);
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
            Se moverá de vuelta a &ldquo;Escribieron a preguntar&rdquo;, sin
            perder los datos ya guardados.
          </p>
        )}

        {error && <p className="text-sm text-achiote">{error}</p>}

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
            className="rounded-md bg-turmeric px-4 py-2 text-sm font-medium text-ink hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Moviendo…" : "Mover pedido"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
