import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Destinations | Travelo",
  description: "Discover amazing destinations worldwide. Search cities, check local currency, and plan your perfect trip.",
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
