import { DashboardShell } from "@/components/DashboardShell";

export const metadata = {
  title: "Dashboard - Licentia",
  description: "License management dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
