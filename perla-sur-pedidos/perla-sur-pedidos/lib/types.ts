export type Source = "instagram" | "whatsapp" | "llamada" | "ff";
export type UserName = "Jose" | "Paulina";
// Internal ids stay the same as before (no data migration needed);
// only the Spanish labels shown to Jose/Paulina changed.
export type Stage = "preguntar" | "realizado" | "enviado";

export const STAGES: { id: Stage; label: string }[] = [
  { id: "preguntar", label: "Procesando" },
  { id: "realizado", label: "Realizado" },
  { id: "enviado", label: "Enviado" },
];

export const SOURCES: { id: Source; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram" },
  { id: "llamada", label: "Llamada" },
  { id: "ff", label: "F&F" },
];

export type MetodoPago = "transferencia" | "link_pago";

export const METODOS_PAGO: { id: MetodoPago; label: string }[] = [
  { id: "transferencia", label: "Transferencia" },
  { id: "link_pago", label: "Link de Pago" },
];

export const USERS: UserName[] = ["Jose", "Paulina"];

export interface Order {
  id: string;
  numero_orden: number;
  source: Source;
  owner: UserName;
  nombre: string;
  celular: string | null;
  usuario_instagram: string | null;
  ciudad: string | null;
  direccion: string | null;
  numero_guia: string | null;
  empresa_envio: string | null;
  costo_total: number | null;
  pago_confirmado: boolean;
  metodo_pago: MetodoPago | null;
  stage: Stage;
  created_at: string;
  updated_at: string;
}

export interface DetalleOrdenItem {
  id: string;
  order_id: string;
  producto: string;
  unidades: number;
  costo_unitario: number;
  descuento: number;
  total_producto: number;
  created_at: string;
}

// Local (not-yet-saved) row shape used while editing the product detail list
export interface DetalleOrdenRow {
  key: string; // client-side only, for React list identity
  producto: string;
  unidades: number;
  costo_unitario: number;
  descuento: number;
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
  costo_total: number;
  metodo_pago: MetodoPago;
}

export interface EnviadoInput {
  numero_guia: string;
  empresa_envio: string;
}

