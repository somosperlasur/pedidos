import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import Board from "@/components/Board";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const session = getSession();
  if (!session) redirect("/login");

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    const cause = (error as unknown as { cause?: unknown }).cause;
    const causeMessage =
      cause instanceof Error
        ? cause.message
        : cause
        ? JSON.stringify(cause)
        : null;

    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-achiote">
            No se pudieron cargar los pedidos: {error.message}
          </p>
          {causeMessage && (
            <p className="mt-2 text-sm text-muted">Detalle: {causeMessage}</p>
          )}
        </div>
      </main>
    );
  }

  return <Board initialOrders={(data ?? []) as Order[]} currentUser={session.user} />;
}
