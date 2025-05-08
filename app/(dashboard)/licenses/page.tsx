import Link from "next/link"
import { Key, Plus } from "lucide-react"

export default function LicensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Licenses</h1>
          <p className="text-muted-foreground">
            Manage software licenses for your products
          </p>
        </div>
        <Link
          href="/licenses/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="mr-1 h-4 w-4" />
          <Key className="mr-2 h-4 w-4" />
          New License
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-medium">Your Licenses</h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search licenses..."
              className="w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div className="divide-y">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <h3 className="font-medium">ABCD-1234-EFGH-5678</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Product: Analytics Dashboard Pro
                </span>
                <span className="text-sm text-muted-foreground">
                  Organization: Acme Corporation
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
                <span className="text-xs text-muted-foreground">
                  Expires: Never
                </span>
              </div>
            </div>
            <div>
              <Link
                href="/licenses/1"
                className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <h3 className="font-medium">WXYZ-9876-MNOP-5432</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Product: CRM Suite
                </span>
                <span className="text-sm text-muted-foreground">
                  Organization: TechStart Solutions
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
                <span className="text-xs text-muted-foreground">
                  Expires: 2025-06-30
                </span>
              </div>
            </div>
            <div>
              <Link
                href="/licenses/2"
                className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <h3 className="font-medium">QWER-7890-ASDF-1234</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Product: E-commerce Platform
                </span>
                <span className="text-sm text-muted-foreground">
                  Organization: GlobalFusion Inc
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                  Expired
                </span>
                <span className="text-xs text-muted-foreground">
                  Expired: 2023-12-31
                </span>
              </div>
            </div>
            <div>
              <Link
                href="/licenses/3"
                className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 