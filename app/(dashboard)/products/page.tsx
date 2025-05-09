export const dynamic = "force-dynamic";

import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import { ProductDeleteButton } from "@/components/ProductDeleteButton";

interface Product {
  id: string | number;
  name: string;
  description: string | null;
}

async function getProducts(): Promise<Product[]> {
  try {
    const data = await getFromApi<{ products: Product[] }>("/api/products");
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your software products</p>
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
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={String(product.id)}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    View
                  </Link>
                  <ProductDeleteButton productId={product.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No products found. Create your first product to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
