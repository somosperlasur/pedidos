"use client";

import { Draggable } from "@hello-pangea/dnd";
import type { Order } from "@/lib/types";
import { SourceBadge, OwnerBadge } from "./Badges";

export default function OrderCard({
  order,
  index,
  onOpen,
  onAdvance,
  advanceLabel,
}: {
  order: Order;
  index: number;
  onOpen: () => void;
  onAdvance?: () => void;
  advanceLabel?: string;
}) {
  return (
    <Draggable draggableId={order.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onOpen}
          className={`group cursor-pointer rounded-md border border-border bg-surface p-3 shadow-card transition-shadow hover:border-turmeric/50 ${
            snapshot.isDragging ? "ring-1 ring-turmeric" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-cream leading-snug">
              <span className="text-muted font-normal">
                #{order.numero_orden}
              </span>{" "}
              {order.nombre}
            </p>
            <SourceBadge source={order.source} />
          </div>

          <div className="mt-2 text-xs text-muted space-y-0.5">
            {order.stage === "preguntar" && (
              <p>
                {order.source === "instagram"
                  ? order.usuario_instagram || "Sin usuario de IG"
                  : order.celular || "Sin celular"}
              </p>
            )}

            {order.stage === "realizado" && (
              <>
                <p>{order.ciudad}</p>
                <p className="truncate">{order.direccion}</p>
                {order.costo_total != null && (
                  <p>
                    {order.costo_total.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    })}
                    {order.pago_confirmado ? " · Pago ✓" : " · Pago pendiente"}
                  </p>
                )}
              </>
            )}

            {order.stage === "enviado" && (
              <>
                <p>{order.empresa_envio}</p>
                <p className="truncate">Guía: {order.numero_guia}</p>
              </>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <OwnerBadge owner={order.owner} />
            {onAdvance && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdvance();
                }}
                className="text-[11px] text-turmeric opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
              >
                {advanceLabel} →
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
