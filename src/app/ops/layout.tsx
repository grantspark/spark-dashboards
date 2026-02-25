import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission Control — Grant Sparks",
  description: "Personal ops dashboard",
};

export default function OpsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
