export const dynamic = 'force-dynamic'

import Link from "next/link"
import { ChevronLeft, Package, AlignJustify, Calendar, Key } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"

interface ProductViewPageProps {
  params: Promise<{
    id: string
  }>
}

interface Product {
  id: string | number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface License {
  id: string | number;
  license_key: string;
  organization: {
    id: string | number;
    name: string;
  };
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

async function getProductData(id: string) {
  try {
    const response = await getFromApi<{ product: Product }>(`/api/products/${id}`);
    return response.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return fallback data if API request fails
    return {
      id,
      name: "Product not found",
      description: "This product could not be loaded",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

async function getProductLicenses(id: string) {
  try {
    const response = await getFromApi<{ licenses: License[] }>(`/api/products/${id}/licenses`);
    return response.licenses;
  } catch (error) {
    console.error('Error fetching product licenses:', error);
    return [];
  }
}

export default async function ProductViewPage({ params }: ProductViewPageProps) {
  const { id } = await params;
  
  // Fetch data in parallel
  const [product, licenses] = await Promise.all([
    getProductData(id),
    getProductLicenses(id)
  ]);

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
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${id}/edit`}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Edit Product
            </Link>
            <Link
              href={`/licenses/new?product=${id}`}
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
              <dd className="text-sm">{product.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created
              </dt>
              <dd className="text-sm">{new Date(product.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last Updated
              </dt>
              <dd className="text-sm">{new Date(product.updated_at).toLocaleString()}</dd>
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
              href={`/licenses/new?product=${id}`}
              className="text-sm text-primary hover:underline"
            >
              Issue new license
            </Link>
          </div>
          
          {licenses && licenses.length > 0 ? (
            <div className="space-y-4">
              {licenses.map(license => (
                <div key={String(license.id)} className="border rounded-md p-4">
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
                href={`/licenses/new?product=${id}`}
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