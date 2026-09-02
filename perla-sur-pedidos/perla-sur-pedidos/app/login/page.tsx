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
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border shadow-card">
        <div className="bg-forest px-8 py-10 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-wordmark.png"
            alt="Perla Sur"
            className="h-20 w-auto"
          />
          <p className="mt-3 text-sm text-logoPeach/80 tracking-wide">
            Pedidos internos
          </p>
        </div>

        <form action={login} className="bg-surface px-6 py-6">
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
                  <span className="block text-center rounded-md border border-border bg-surfaceRaised py-2 text-sm text-ink cursor-pointer transition-colors peer-checked:border-orange peer-checked:text-orange peer-checked:bg-orange/10">
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
              className="w-full rounded-md border border-border bg-surfaceRaised px-3 py-2 text-ink placeholder:text-muted/60 focus:border-orange"
              placeholder="••••••••"
            />
          </label>

          {hasError && (
            <p className="mb-4 text-sm text-red-700">
              Usuario o contraseña incorrectos. Intenta de nuevo.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-orange text-white font-medium py-2.5 transition-opacity hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
