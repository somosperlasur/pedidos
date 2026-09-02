# Perla Sur — Pedidos internos

App interna (Next.js + Supabase) para mover los pedidos de WhatsApp/Instagram
por el pipeline: **Escribieron a preguntar → Pedido realizado → Pedido enviado**.

- Login simple con usuario (Jose / Paulina) + una contraseña compartida.
- Tablero tipo Kanban: arrastra y suelta las tarjetas, o usa el botón rápido
  "→" que aparece al pasar el mouse sobre la tarjeta.
- Cada pedido guarda: fuente (Instagram / WhatsApp / Llamada), quién lo
  registró, nombre, celular, usuario de Instagram, ciudad, dirección, número
  de guía y empresa de envío.
- Al mover un pedido a "Pedido realizado" o "Pedido enviado", si faltan los
  datos de esa etapa (ciudad/dirección o guía/empresa), la app los pide antes
  de mover la tarjeta.
- Todo se guarda en tu proyecto de Supabase, en la tabla `orders`.

## 1. Crear la tabla en Supabase

1. Entra a tu proyecto de Supabase → **SQL Editor**.
2. Pega y ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql).
   Esto crea la tabla `orders` con las columnas necesarias, un índice por
   etapa, y activa Row Level Security (la app se conecta con la *service
   role key* desde el servidor, así que no hace falta ninguna policy pública).

## 2. Variables de entorno

Copia `.env.example` a `.env.local` (para desarrollo) y completa:

| Variable | Dónde encontrarla |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` (secreta, nunca la publiques) |
| `APP_PASSWORD` | La eliges tú — la contraseña que usarán Jose y Paulina para entrar |
| `SESSION_SECRET` | Cadena aleatoria larga, ej: `openssl rand -base64 32` |

**Importante:** ninguna de estas variables debe llevar el prefijo
`NEXT_PUBLIC_` — así el navegador nunca las ve. Solo el servidor de Next.js
habla con Supabase.

## 3. Correr en local (opcional)

```bash
npm install
npm run dev
```

Abre http://localhost:3000 — te va a mandar a `/login`.

## 4. Desplegar en Vercel

1. Sube esta carpeta a un repo de GitHub (o usa `vercel` CLI directo).
2. En Vercel: **New Project** → importa el repo.
3. En **Environment Variables**, agrega las 4 variables de la tabla de arriba
   (con los valores reales de tu Supabase, no los de ejemplo).
4. Deploy.
5. Comparte la URL + la contraseña con Jose y Paulina. Cada uno elige su
   nombre al entrar — así queda registrado quién metió cada pedido.

## Cómo se usa día a día

1. Alguien escribe por WhatsApp o Instagram → clic en **"+ Nuevo pedido"**,
   eliges la fuente, nombre, y celular o usuario de Instagram según
   corresponda. Queda en la columna **"Escribieron a preguntar"**.
2. Cuando confirma el pedido: arrastra la tarjeta (o usa el botón "→") a
   **"Pedido realizado"** — te pedirá ciudad y dirección.
3. Cuando lo despachas: arrastra a **"Pedido enviado"** — te pedirá número de
   guía y empresa de envío.
4. Haz clic en cualquier tarjeta para ver o editar todos sus datos, o para
   eliminarla si fue un error.

## Notas técnicas

- Next.js 14 (App Router) + Server Actions, sin backend aparte.
- Todas las escrituras a Supabase ocurren en el servidor con la
  `service_role key` — el navegador nunca la recibe.
- La sesión es una cookie `httpOnly` firmada con `SESSION_SECRET` (HMAC),
  válida 14 días.
- Drag & drop con `@hello-pangea/dnd`.
