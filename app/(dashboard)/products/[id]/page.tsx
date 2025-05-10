export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ChevronLeft,
  Package,
  AlignJustify,
  Calendar,
  Key,
  Plus,
} from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import { ProductDeleteButton } from "@/components/ProductDeleteButton";
import { LicenseDeleteButton } from "@/components/LicenseDeleteButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductViewPageProps {
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

async function getProductLicenses(id: string) {
  try {
    const response = await getFromApi<{ licenses: License[] }>(
      `/api/products/${id}/licenses`
    );
    return response.licenses;
  } catch (error) {
    console.error("Error fetching product licenses:", error);
    return [];
  }
}

export default async function ProductViewPage({
  params,
}: ProductViewPageProps) {
  const { id } = await params;

  // Fetch data in parallel
  const [product, licenses] = await Promise.all([
    getProductData(id),
    getProductLicenses(id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="px-0 text-muted-foreground hover:text-foreground"
        >
          <Link href="/products" className="inline-flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/products/${id}/edit`}>Edit Product</Link>
            </Button>
            <ProductDeleteButton productId={id} variant="button" />
            <Button asChild>
              <Link href={`/licenses/new?product=${id}`}>
                <Plus className="h-4 w-4" />
                Issue License
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5 text-primary" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="grid gap-1">
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <AlignJustify className="h-4 w-4 text-muted-foreground" />
                  Description
                </dt>
                <dd className="text-foreground">{product.description}</dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Created
                </dt>
                <dd className="text-foreground">
                  {new Date(product.created_at).toLocaleString()}
                </dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Last Updated
                </dt>
                <dd className="text-foreground">
                  {new Date(product.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Key className="h-5 w-5 text-primary" />
                Licenses
              </CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
              >
                <Link href={`/licenses/new?product=${id}`}>
                  <Plus className="h-3.5 w-3.5" />
                  Issue new license
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {licenses && licenses.length > 0 ? (
              <div className="space-y-4">
                {licenses.map((license) => (
                  <div
                    key={String(license.id)}
                    className="border rounded-md p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        href={`/licenses/${license.id}`}
                        className="font-semibold hover:underline text-foreground"
                      >
                        {license.license_key}
                      </Link>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            license.is_active ? "default" : "destructive"
                          }
                          className={
                            license.is_active
                              ? "bg-green-100 hover:bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {license.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <LicenseDeleteButton licenseId={license.id} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">
                          Organization:
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {license.organization.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">Created:</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(license.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">Expires:</span>
                        <span className="text-sm text-muted-foreground">
                          {license.expires_at
                            ? new Date(license.expires_at).toLocaleDateString()
                            : "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Key className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium mb-1">No licenses found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This product doesn&apos;t have any licenses yet.
                </p>
                <Button asChild>
                  <Link href={`/licenses/new?product=${id}`}>
                    <Plus className="h-4 w-4 mr-1" />
                    Issue first license
                  </Link>
                </Button>
              </div>
            )}

            {licenses && licenses.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium mb-3">License Statistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted/50 rounded-md p-3">
                    <div className="text-sm text-muted-foreground mb-1">
                      Active Licenses
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {licenses.filter((l) => l.is_active).length}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <div className="text-sm text-muted-foreground mb-1">
                      Total Licenses
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {licenses.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
