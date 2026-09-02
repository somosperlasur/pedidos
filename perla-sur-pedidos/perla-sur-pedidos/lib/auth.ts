import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { UserName } from "./types";

const COOKIE_NAME = "ps_session";
const SESSION_DAYS = 14;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta la variable de entorno SESSION_SECRET");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export interface Session {
  user: UserName;
  exp: number;
}

export async function createSession(user: UserName) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ user, exp })).toString(
    "base64url"
  );
  const signature = sign(payload);
  const token = `${payload}.${signature}`;

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export function getSession(): Session | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as Session;
    if (!data.exp || data.exp < Date.now()) return null;
    if (data.user !== "Jose" && data.user !== "Paulina") return null;
    return data;
  } catch {
    return null;
  }
}

export function checkPassword(password: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    throw new Error("Falta la variable de entorno APP_PASSWORD");
  }
  // Pad to equal length before compare to keep this timing-safe even
  // when lengths differ.
  const a = Buffer.from(password.padEnd(64, "\0"));
  const b = Buffer.from(expected.padEnd(64, "\0"));
  return a.length === b.length && timingSafeEqual(a, b);
}
