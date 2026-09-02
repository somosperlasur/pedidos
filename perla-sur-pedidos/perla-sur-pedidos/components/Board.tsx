"use client";

import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import type { DetalleOrdenItem, DetalleOrdenRow, Order, Stage, UserName } from "@/lib/types";
import { STAGES } from "@/lib/types";
import {
  createOrder,
  moveOrderStage,
  updateOrderFields,
  saveDetalleOrden,
  deleteOrder,
  logout,
} from "@/app/board/actions";
import OrderCard from "./OrderCard";
import NewOrderModal from "./NewOrderModal";
import StageFieldsModal from "./StageFieldsModal";
import EditOrderModal from "./EditOrderModal";

const NEXT_STAGE: Record<Stage, Stage | null> = {
  preguntar: "realizado",
  realizado: "enviado",
  enviado: null,
};

const NEXT_LABEL: Record<Stage, string> = {
  preguntar: "Realizado",
  realizado: "Enviado",
  enviado: "",
};

function needsExtraFields(target: Stage): boolean {
  return target === "realizado" || target === "enviado";
}

function hasRequiredFields(
  order: Order,
  target: Stage,
  detalleCount: number
): boolean {
  if (target === "realizado") {
    return (
      !!order.ciudad &&
      !!order.direccion &&
      order.costo_total != null &&
      detalleCount > 0
    );
  }
  if (target === "enviado")
    return !!order.numero_guia && !!order.empresa_envio;
  return true;
}

function itemsToRows(items: DetalleOrdenItem[]): DetalleOrdenRow[] {
  return items.map((item) => ({
    key: item.id,
    producto: item.producto,
    precio: item.precio,
    descuento: item.descuento,
  }));
}

export default function Board({
  initialOrders,
  initialDetalleByOrder,
  currentUser,
}: {
  initialOrders: Order[];
  initialDetalleByOrder: Record<string, DetalleOrdenItem[]>;
  currentUser: UserName;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [detalleByOrder, setDetalleByOrder] = useState(initialDetalleByOrder);
  const [showNew, setShowNew] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    order: Order;
    target: Stage;
  } | null>(null);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    setDetalleByOrder(initialDetalleByOrder);
  }, [initialDetalleByOrder]);

  const columns = useMemo(() => {
    const grouped: Record<Stage, Order[]> = {
      preguntar: [],
      realizado: [],
      enviado: [],
    };
    for (const order of orders) grouped[order.stage].push(order);
    return grouped;
  }, [orders]);

  function applyLocalMove(id: string, stage: Stage, extra?: Partial<Order>) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, stage, ...extra } : o))
    );
  }

  async function performMove(
    order: Order,
    target: Stage,
    extraFields?: Record<string, string | number>,
    detalleRows?: DetalleOrdenRow[]
  ) {
    applyLocalMove(order.id, target, extraFields as Partial<Order>);
    await moveOrderStage(order.id, target, extraFields);

    if (detalleRows) {
      const items = detalleRows.map(({ producto, precio, descuento }) => ({
        producto,
        precio,
        descuento,
      }));
      setDetalleByOrder((prev) => ({
        ...prev,
        [order.id]: detalleRows.map((r) => ({
          id: r.key,
          order_id: order.id,
          producto: r.producto,
          precio: r.precio,
          descuento: r.descuento,
          costo_total_orden: r.precio - r.descuento,
          created_at: new Date().toISOString(),
        })),
      }));
      await saveDetalleOrden(order.id, items);
    }
  }

  function requestMove(order: Order, target: Stage) {
    const detalleCount = detalleByOrder[order.id]?.length ?? 0;
    if (
      needsExtraFields(target) &&
      !hasRequiredFields(order, target, detalleCount)
    ) {
      setPendingMove({ order, target });
      return;
    }
    void performMove(order, target);
  }

  function handleAdvance(order: Order) {
    const next = NEXT_STAGE[order.stage];
    if (!next) return;
    requestMove(order, next);
  }

  function handleDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const order = orders.find((o) => o.id === draggableId);
    if (!order) return;
    requestMove(order, destination.droppableId as Stage);
  }

  return (
    <main className="min-h-screen">
      <header className="bg-forest px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wordmark.png" alt="Perla Sur" className="h-9 w-auto" />
          <p className="text-xs text-logoPeach/70 hidden sm:block">
            Pedidos internos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNew(true)}
            className="rounded-md bg-orange px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            + Nuevo pedido
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-logoPeach/80">{currentUser}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs text-logoPeach/60 hover:text-white"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          {STAGES.map((stage) => (
            <Droppable droppableId={stage.id} key={stage.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-lg border border-border p-3 min-h-[60vh] transition-colors ${
                    snapshot.isDraggingOver ? "bg-surfaceRaised" : "bg-paper"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h2 className="text-sm font-medium text-ink">
                      {stage.label}
                    </h2>
                    <span className="text-xs text-muted">
                      {columns[stage.id].length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {columns[stage.id].map((order, index) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        index={index}
                        onOpen={() => setEditingOrder(order)}
                        onAdvance={
                          NEXT_STAGE[order.stage]
                            ? () => handleAdvance(order)
                            : undefined
                        }
                        advanceLabel={NEXT_LABEL[order.stage]}
                      />
                    ))}
                    {provided.placeholder}
                  </div>

                  {columns[stage.id].length === 0 && (
                    <p className="px-1 text-xs text-muted/70">
                      No hay pedidos en esta etapa.
                    </p>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showNew && (
        <NewOrderModal
          onClose={() => setShowNew(false)}
          onCreate={async (input) => {
            await createOrder(input);
          }}
        />
      )}

      {pendingMove && (
        <StageFieldsModal
          order={pendingMove.order}
          targetStage={pendingMove.target}
          initialDetalleRows={itemsToRows(
            detalleByOrder[pendingMove.order.id] ?? []
          )}
          onClose={() => setPendingMove(null)}
          onConfirm={async (fields, detalleRows) => {
            await performMove(
              pendingMove.order,
              pendingMove.target,
              fields,
              detalleRows
            );
          }}
        />
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          initialDetalleRows={itemsToRows(
            detalleByOrder[editingOrder.id] ?? []
          )}
          onClose={() => setEditingOrder(null)}
          onSave={async (fields, detalleRows) => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === editingOrder.id ? { ...o, ...fields } : o
              )
            );
            await updateOrderFields(editingOrder.id, fields);

            const items = detalleRows.map(({ producto, precio, descuento }) => ({
              producto,
              precio,
              descuento,
            }));
            setDetalleByOrder((prev) => ({
              ...prev,
              [editingOrder.id]: detalleRows.map((r) => ({
                id: r.key,
                order_id: editingOrder.id,
                producto: r.producto,
                precio: r.precio,
                descuento: r.descuento,
                costo_total_orden: r.precio - r.descuento,
                created_at: new Date().toISOString(),
              })),
            }));
            await saveDetalleOrden(editingOrder.id, items);
          }}
          onDelete={async () => {
            setOrders((prev) => prev.filter((o) => o.id !== editingOrder.id));
            await deleteOrder(editingOrder.id);
          }}
        />
      )}
    </main>
  );
}
