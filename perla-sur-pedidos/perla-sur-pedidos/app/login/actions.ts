"use server";

import { redirect } from "next/navigation";
import { checkPassword, createSession } from "@/lib/auth";
import { USERS, type UserName } from "@/lib/types";

export async function login(formData: FormData) {
  const user = formData.get("user");
  const password = formData.get("password");

  if (typeof user !== "string" || typeof password !== "string") {
    redirect("/login?error=1");
  }

  if (!USERS.includes(user as UserName)) {
    redirect("/login?error=1");
  }

  if (!checkPassword(password)) {
    redirect("/login?error=1");
  }

  await createSession(user as UserName);
  redirect("/board");
}
