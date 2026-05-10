"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  try {
    const userCount = await prisma.user.count();
    
    const expenses = await prisma.expense.aggregate({
      _sum: { amount: true }
    });

    const recentLogs = await prisma.actionLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    const topSearches = await prisma.searchLog.findMany({
      orderBy: { count: 'desc' },
      take: 5
    });

    return {
      success: true,
      stats: {
        userCount,
        totalExpenses: expenses._sum?.amount || 0,
        recentLogs,
        topSearches
      }
    };
  } catch (err: any) {
    return { error: err.message };
  }
}
