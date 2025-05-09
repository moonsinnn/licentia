export const dynamic = "force-dynamic";

import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import { ProductDeleteButton } from "@/components/ProductDeleteButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          <p className="text-muted-foreground">Manage your products</p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="h-4 w-4" />
            <Package className="h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      <Card className="border shadow-sm">
        <div className="divide-y">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={String(product.id)}
                className="flex items-center justify-between p-4"
              >
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-semibold text-foreground">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/products/${product.id}`}>View</Link>
                  </Button>
                  <ProductDeleteButton productId={product.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first product to get started.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/products/new">
                  <Plus className="h-4 w-4 mr-1" />
                  New Product
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
