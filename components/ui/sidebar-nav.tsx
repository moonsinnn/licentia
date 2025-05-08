"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  disabled?: boolean
}

interface SidebarNavProps {
  items: NavItem[]
  className?: string
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.disabled ? "#" : item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
} 