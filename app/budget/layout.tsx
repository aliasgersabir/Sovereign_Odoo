import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Tracker | Travelo",
  description: "Track and manage your travel expenses with Travelo's budget breakdown tool. Categorize spending and stay on budget.",
};

export default function BudgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
