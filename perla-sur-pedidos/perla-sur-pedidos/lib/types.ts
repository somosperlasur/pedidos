export type Source = "instagram" | "whatsapp" | "llamada";
export type UserName = "Jose" | "Paulina";
export type Stage = "preguntar" | "realizado" | "enviado";

export const STAGES: { id: Stage; label: string }[] = [
  { id: "preguntar", label: "Escribieron a preguntar" },
  { id: "realizado", label: "Pedido realizado" },
  { id: "enviado", label: "Pedido enviado" },
];

export const SOURCES: { id: Source; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram" },
  { id: "llamada", label: "Llamada" },
];

export const USERS: UserName[] = ["Jose", "Paulina"];

export interface Order {
  id: string;
  source: Source;
  owner: UserName;
  nombre: string;
  celular: string | null;
  usuario_instagram: string | null;
  ciudad: string | null;
  direccion: string | null;
  numero_guia: string | null;
  empresa_envio: string | null;
  stage: Stage;
  created_at: string;
  updated_at: string;
}

export interface NewOrderInput {
  source: Source;
  nombre: string;
  celular?: string;
  usuario_instagram?: string;
}

export interface RealizadoInput {
  ciudad: string;
  direccion: string;
}

export interface EnviadoInput {
  numero_guia: string;
  empresa_envio: string;
}
