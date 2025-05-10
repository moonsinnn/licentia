export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import ProductForm from "@/components/ProductForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Product {
  id: string | number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

async function getProductData(id: string) {
  try {
    const response = await getFromApi<{ product: Product }>(
      `/api/products/${id}`
    );
    return response.product;
  } catch (error) {
    console.error("Error fetching product:", error);
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

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { id } = await params;
  const product = await getProductData(id);

  return (
    <div className="space-y-6">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="px-0 text-muted-foreground hover:text-foreground"
        >
          <Link
            href={`/products/${id}`}
            className="inline-flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Product
          </Link>
        </Button>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit Product</h1>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <ProductForm product={product} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
