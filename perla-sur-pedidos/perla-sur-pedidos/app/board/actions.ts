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

export async function moveOrderStage(
  id: string,
  stage: Stage,
  extraFields?: Partial<{
    ciudad: string;
    direccion: string;
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
