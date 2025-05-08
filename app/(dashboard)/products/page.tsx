import Link from "next/link"
import { Package, Plus } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your software products
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="mr-1 h-4 w-4" />
          <Package className="mr-2 h-4 w-4" />
          New Product
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-medium">Your Products</h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div className="divide-y">
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-medium">Analytics Dashboard Pro</h3>
              <p className="text-sm text-muted-foreground">
                Professional analytics dashboard with advanced features
              </p>
            </div>
            <div>
              <Link
                href="/products/1"
                className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-medium">CRM Suite</h3>
              <p className="text-sm text-muted-foreground">
                Complete customer relationship management solution
              </p>
            </div>
            <div>
              <Link
                href="/products/2"
                className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-medium">E-commerce Platform</h3>
              <p className="text-sm text-muted-foreground">
                Full-featured e-commerce solution for online stores
              </p>
            </div>
            <div>
              <Link
                href="/products/3"
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