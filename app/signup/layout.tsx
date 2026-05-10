import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Travelo",
  description: "Create your Travelo account. Start planning premium travel experiences today.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
