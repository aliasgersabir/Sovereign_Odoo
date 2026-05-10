import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Itinerary | Travelo",
  description: "Plan your day-by-day travel itinerary. Add activities, set times, and share your trip with friends.",
};

export default function ItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
