import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"
import ProductForm from "@/components/ProductForm"

interface ProductEditPageProps {
  params: {
    id: string
  }
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

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const productId = (await params).id;
  const product = await getProductData(productId);

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href={`/products/${productId}`} 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Product
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit Product</h1>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <ProductForm product={product} />
        </div>
      </div>
    </div>
  )
} 