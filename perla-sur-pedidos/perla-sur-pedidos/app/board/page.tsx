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
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-achiote">
          No se pudieron cargar los pedidos: {error.message}
        </p>
      </main>
    );
  }

  return <Board initialOrders={(data ?? []) as Order[]} currentUser={session.user} />;
}
