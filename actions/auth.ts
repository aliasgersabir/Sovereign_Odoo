"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function registerUser(data: { email: string; password?: string; fullName?: string }) {
  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) return { error: "Email already exists" };

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: data.password || "", // Plain text for rapid prototype
        fullName: data.fullName,
      }
    });

    const cookieStore = await cookies();
    cookieStore.set("session", user.id, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    return { success: true, user: { email: user.email, fullName: user.fullName } };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function loginUser(data: { email: string; password?: string }) {
  try {
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!user || user.password !== data.password) {
      return { error: "Invalid credentials" };
    }

    const cookieStore = await cookies();
    cookieStore.set("session", user.id, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    return { success: true, user: { email: user.email, fullName: user.fullName } };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) return null;

  const user = await prisma.user.findUnique({ where: { id: sessionId }, select: { id: true, email: true, fullName: true } });
  return user;
}
