import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Travelo",
  description: "Monitor platform usage, engagement metrics, and travel trends on the Travelo admin dashboard.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
