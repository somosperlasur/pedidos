"use client";

import { useState, useTransition } from "react";
import { SOURCES, type Source } from "@/lib/types";
import Modal from "./Modal";

export default function NewOrderModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: {
    source: Source;
    nombre: string;
    celular?: string;
    usuario_instagram?: string;
  }) => Promise<void>;
}) {
  const [source, setSource] = useState<Source>("whatsapp");
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [usuario, setUsuario] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const needsUsuario = source === "instagram";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (needsUsuario && !usuario.trim()) {
      setError("El usuario de Instagram es obligatorio.");
      return;
    }
    if (!needsUsuario && !celular.trim()) {
      setError("El celular es obligatorio.");
      return;
    }

    startTransition(async () => {
      try {
        await onCreate({
          source,
          nombre,
          celular: needsUsuario ? undefined : celular,
          usuario_instagram: needsUsuario ? usuario : undefined,
        });
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo salió mal.");
      }
    });
  }

  return (
    <Modal title="Escribieron a preguntar" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="text-sm text-muted mb-2 block">¿Por dónde escribió?</span>
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
            placeholder="Nombre del cliente"
            autoFocus
          />
        </label>

        {needsUsuario ? (
          <label className="block">
            <span className="text-sm text-muted mb-2 block">Usuario de Instagram</span>
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
              placeholder="@usuario"
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-sm text-muted mb-2 block">Celular</span>
            <input
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream focus:border-turmeric"
              placeholder="300 000 0000"
            />
          </label>
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
            {isPending ? "Guardando…" : "Registrar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
