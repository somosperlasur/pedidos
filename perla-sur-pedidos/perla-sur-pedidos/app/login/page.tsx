import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { USERS } from "@/lib/types";
import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = getSession();
  if (session) redirect("/board");

  const hasError = searchParams.error === "1";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-display text-3xl text-cream tracking-tight">
            Perla Sur
          </p>
          <p className="mt-1 text-sm text-muted">Pedidos internos</p>
        </div>

        <form
          action={login}
          className="bg-surface border border-border rounded-lg p-6 shadow-card"
        >
          <fieldset className="mb-5">
            <legend className="text-sm text-muted mb-2">¿Quién eres?</legend>
            <div className="grid grid-cols-2 gap-2">
              {USERS.map((user, i) => (
                <label key={user} className="relative">
                  <input
                    type="radio"
                    name="user"
                    value={user}
                    defaultChecked={i === 0}
                    className="peer sr-only"
                    required
                  />
                  <span className="block text-center rounded-md border border-border bg-surfaceRaised py-2 text-sm text-cream cursor-pointer transition-colors peer-checked:border-turmeric peer-checked:text-turmeric peer-checked:bg-turmeric/10">
                    {user}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block mb-5">
            <span className="text-sm text-muted mb-2 block">Contraseña</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-cream placeholder:text-muted/60 focus:border-turmeric"
              placeholder="••••••••"
            />
          </label>

          {hasError && (
            <p className="mb-4 text-sm text-achiote">
              Usuario o contraseña incorrectos. Intenta de nuevo.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-turmeric text-ink font-medium py-2.5 transition-opacity hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
