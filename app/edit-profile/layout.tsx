import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile | Travelo",
  description: "Update your Travelo account details, name, and password.",
};

export default function EditProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
