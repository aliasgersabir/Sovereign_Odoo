"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "./auth";

export async function addExpense(data: { amount: number; category: string }) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const expense = await prisma.expense.create({
      data: {
        userId: session.id,
        amount: data.amount,
        category: data.category,
      }
    });

    await prisma.actionLog.create({ data: { action: "User added an expense" } });

    return { success: true, expense };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getExpenses() {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: session.id },
      orderBy: { date: "desc" }
    });
    return { success: true, expenses };
  } catch (err: any) {
    return { error: err.message };
  }
}
