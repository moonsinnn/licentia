import { DashboardShell } from "@/components/DashboardShell";

export const metadata = {
  title: "Dashboard - Licenium",
  description: "License management dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
