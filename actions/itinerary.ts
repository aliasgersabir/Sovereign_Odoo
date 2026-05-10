"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "./auth";

export async function saveItinerary(data: { city: string; country: string; days: any[] }) {
  const session = await getSession();
  
  try {
    const itinerary = await prisma.itinerary.create({
      data: {
        userId: session?.id || null, // Allow anonymous itinerary creation
        city: data.city,
        country: data.country,
        days: {
          create: data.days.map((day, index) => ({
            day: index + 1,
            title: day.title || `Day ${index + 1}`,
            activities: {
              create: day.activities.map((act: any) => ({
                time: act.time || "09:00",
                name: act.name || "Activity",
                notes: act.notes || null,
              }))
            }
          }))
        }
      }
    });

    await prisma.actionLog.create({ data: { action: `Generated itinerary for ${data.city}` } });
    await prisma.searchLog.upsert({
      where: { city_country: { city: data.city, country: data.country } },
      update: { count: { increment: 1 } },
      create: { city: data.city, country: data.country }
    });

    return { success: true, id: itinerary.id };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getItinerary(id: string) {
  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        days: {
          include: { activities: true }
        }
      }
    });

    if (!itinerary) return { error: "Not found" };
    return { success: true, itinerary };
  } catch (err: any) {
    return { error: err.message };
  }
}
