import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Travelo",
  description: "Sign in to your Travelo account. Access your saved trips, budget tools, and travel itineraries.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
