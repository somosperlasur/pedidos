"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession, destroySession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { Stage, Source, UserName } from "@/lib/types";

function requireSession() {
  const session = getSession();
  if (!session) redirect("/login");
  return session;
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function createOrder(input: {
  source: Source;
  nombre: string;
  celular?: string;
  usuario_instagram?: string;
}) {
  const session = requireSession();

  const { error } = await supabaseAdmin.from("orders").insert({
    source: input.source,
    owner: session.user,
    nombre: input.nombre.trim(),
    celular: input.celular?.trim() || null,
    usuario_instagram: input.usuario_instagram?.trim() || null,
    stage: "preguntar" as Stage,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/board");
}

export async function updateOrderFields(
  id: string,
  fields: Partial<{
    nombre: string;
    celular: string | null;
    usuario_instagram: string | null;
    ciudad: string | null;
    direccion: string | null;
    numero_guia: string | null;
    empresa_envio: string | null;
    costo_total: number | null;
    pago_confirmado: boolean;
    source: Source;
  }>
) {
  requireSession();

  const { error } = await supabaseAdmin
    .from("orders")
    .update(fields)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/board");
}

export async function saveDetalleOrden(
  orderId: string,
  items: { producto: string; precio: number; descuento: number }[]
) {
  requireSession();

  // Reemplaza todas las líneas de este pedido por las que llegan ahora.
  // Sencillo y suficiente para el volumen de un equipo de 2 personas.
  const { error: deleteError } = await supabaseAdmin
    .from("detalle_orden")
    .delete()
    .eq("order_id", orderId);

  if (deleteError) throw new Error(deleteError.message);

  const cleanItems = items
    .map((item) => ({
      order_id: orderId,
      producto: item.producto.trim(),
      precio: Number.isFinite(item.precio) ? item.precio : 0,
      descuento: Number.isFinite(item.descuento) ? item.descuento : 0,
    }))
    .filter((item) => item.producto.length > 0);

  if (cleanItems.length > 0) {
    const { error: insertError } = await supabaseAdmin
      .from("detalle_orden")
      .insert(cleanItems);

    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath("/board");
}

export async function moveOrderStage(
  id: string,
  stage: Stage,
  extraFields?: Partial<{
    ciudad: string;
    direccion: string;
    costo_total: number;
    numero_guia: string;
    empresa_envio: string;
  }>
) {
  requireSession();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ stage, ...(extraFields ?? {}) })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/board");
}

export async function deleteOrder(id: string) {
  requireSession();
  const { error } = await supabaseAdmin.from("orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/board");
}
