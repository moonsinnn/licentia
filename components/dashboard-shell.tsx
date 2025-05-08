"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { SidebarNav, NavItem } from "@/components/ui/sidebar-nav"
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
  FileJson
} from "lucide-react"

const sidebarItems: NavItem[] = [
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
    disabled: true,
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
    disabled: true,
  },
]

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold">
              <span className="text-primary">Licentia</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="block md:hidden"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <nav className="hidden md:flex items-center gap-4">
            <Link 
              href="/logout" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background pt-16">
          <div className="container mx-auto px-4 py-4">
            <SidebarNav items={sidebarItems} className="py-2" />
            <div className="mt-4 pt-4 border-t">
              <Link 
                href="/logout" 
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pl-2 pr-2">
            <SidebarNav items={sidebarItems} className="py-2" />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
    </div>
  )
} 