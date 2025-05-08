import Link from "next/link"
import { ChevronLeft, Package, AlignJustify, Calendar, Key } from "lucide-react"

interface ProductViewPageProps {
  params: {
    id: string
  }
}

export default function ProductViewPage({ params }: ProductViewPageProps) {
  // We would fetch the product details by ID
  const productId = params.id
  
  // Mock data for display purposes
  const productData = {
    id: productId,
    name: "Analytics Dashboard Pro",
    description: "Professional analytics dashboard with advanced features for data visualization, reporting, and insights. Includes customizable widgets, real-time data processing, and export capabilities.",
    created_at: "2023-08-15T00:00:00Z",
    updated_at: "2023-08-15T00:00:00Z",
  }

  // Mock licenses for this product
  const licenses = [
    {
      id: "1",
      license_key: "ABCD-1234-EFGH-5678",
      organization: {
        id: "1",
        name: "Acme Corporation",
      },
      is_active: true,
      expires_at: null,
      created_at: "2023-09-15T00:00:00Z",
    },
    {
      id: "3",
      license_key: "POIU-4567-LKJH-8901",
      organization: {
        id: "3",
        name: "GlobalFusion Inc",
      },
      is_active: false,
      expires_at: "2023-12-31T00:00:00Z",
      created_at: "2023-06-10T00:00:00Z",
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/products" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{productData.name}</h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${productId}/edit`}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Edit Product
            </Link>
            <Link
              href={`/licenses/new?product=${productId}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Issue License
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <AlignJustify className="h-4 w-4" />
                Description
              </dt>
              <dd className="text-sm">{productData.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created
              </dt>
              <dd className="text-sm">{new Date(productData.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last Updated
              </dt>
              <dd className="text-sm">{new Date(productData.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Key className="h-5 w-5" />
              Licenses
            </h2>
            <Link
              href={`/licenses/new?product=${productId}`}
              className="text-sm text-primary hover:underline"
            >
              Issue new license
            </Link>
          </div>
          
          {licenses.length > 0 ? (
            <div className="space-y-4">
              {licenses.map(license => (
                <div key={license.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/licenses/${license.id}`}
                      className="font-medium hover:underline"
                    >
                      {license.license_key}
                    </Link>
                    <span className={`inline-flex h-5 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      license.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {license.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>
                      Organization: {license.organization.name}
                    </div>
                    <div>
                      Created: {new Date(license.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      Expires: {license.expires_at ? new Date(license.expires_at).toLocaleDateString() : "Never"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No licenses issued for this product</p>
              <Link
                href={`/licenses/new?product=${productId}`}
                className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Issue first license
              </Link>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">License Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Active Licenses</div>
                <div className="text-2xl font-bold">{licenses.filter(l => l.is_active).length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Licenses</div>
                <div className="text-2xl font-bold">{licenses.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 