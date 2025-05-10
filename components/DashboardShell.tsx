"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { SidebarNav, NavItem } from "@/components/ui/sidebar-nav";
import {
  LayoutDashboard,
  Building2,
  Package,
  Key,
  BarChart4,
  Settings,
  LogOut,
  Menu,
  X,
  FileJson,
  Users,
  Shield,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Function to get sidebar items based on user role
const getSidebarItems = (role?: string): NavItem[] => {
  const baseItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Organizations",
      href: "/organizations",
      icon: Building2,
    },
    {
      title: "Products",
      href: "/products",
      icon: Package,
    },
    {
      title: "Licenses",
      href: "/licenses",
      icon: Key,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart4,
    },
    {
      title: "API Docs",
      href: "/api-docs",
      icon: FileJson,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  // Add Users management link for super_admin users
  if (role === "super_admin") {
    baseItems.splice(6, 0, {
      title: "Users",
      href: "/users",
      icon: Users,
    });
  }

  return baseItems;
};

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarItems, setSidebarItems] = useState<NavItem[]>([]);

  // Update sidebar items when session changes
  useEffect(() => {
    setSidebarItems(getSidebarItems(session?.user?.role));
  }, [session]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-bold text-lg transition-colors hover:text-primary"
            >
              <Shield className="h-5 w-5 text-primary" />
              <span>Licenium</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <nav className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              {session?.user?.name}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pt-16 animate-in fade-in duration-200">
          <div className="container mx-auto px-4 py-6">
            <Card className="p-4">
              <SidebarNav items={sidebarItems} className="py-2" />
              <div className="mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 flex-1 items-start md:grid md:grid-cols-[240px_1fr] md:gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <div
            className={cn(
              "h-full py-8 pr-6",
              "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent overflow-y-auto"
            )}
          >
            <Card className="p-4 shadow-sm border border-border/50">
              <SidebarNav items={sidebarItems} className="py-2" />
            </Card>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
