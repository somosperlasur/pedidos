-- Perla Sur — tabla de pedidos internos
-- Ejecuta este script completo en el SQL Editor de tu proyecto de Supabase.

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  -- de dónde llegó el pedido
  source text not null check (source in ('instagram', 'whatsapp', 'llamada')),

  -- quién lo registró: Jose o Paulina
  owner text not null check (owner in ('Jose', 'Paulina')),

  -- etapa dentro del pipeline
  stage text not null default 'preguntar'
    check (stage in ('preguntar', 'realizado', 'enviado')),

  -- datos del cliente / pedido
  nombre text not null,
  celular text,
  usuario_instagram text,
  ciudad text,
  direccion text,
  numero_guia text,
  empresa_envio text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_stage_idx on public.orders (stage);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- mantener updated_at al día automáticamente
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row
  execute function public.set_updated_at();

-- Seguridad: la app se conecta con la Service Role Key desde el servidor
-- (Next.js), nunca desde el navegador, así que activamos RLS y no
-- agregamos ninguna policy para el rol "anon"/"authenticated". Esto evita
-- que la tabla quede expuesta si alguna vez se usa la clave pública.
alter table public.orders enable row level security;
