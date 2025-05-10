export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import LicenseForm from "@/components/LicenseForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LicenseEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Organization {
  id: string | number;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
}

interface License {
  id: string | number;
  license_key: string;
  organization_id: string | number;
  product_id: string | number;
  organization: Organization;
  product: Product;
  allowed_domains: string[];
  max_activations: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

async function getLicenseData(id: string) {
  try {
    const response = await getFromApi<{ license: License }>(
      `/api/licenses/${id}`
    );
    return response.license;
  } catch (error) {
    console.error("Error fetching license:", error);
    return null;
  }
}

async function getOrganizations() {
  try {
    const response = await getFromApi<{ organizations: Organization[] }>(
      "/api/organizations"
    );
    return response.organizations || [];
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await getFromApi<{ products: Product[] }>("/api/products");
    return response.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function LicenseEditPage({
  params,
}: LicenseEditPageProps) {
  const { id } = await params;

  // Fetch data in parallel
  const [license, organizations, products] = await Promise.all([
    getLicenseData(id),
    getOrganizations(),
    getProducts(),
  ]);

  if (!license) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <h1 className="text-xl font-bold mb-2">License not found</h1>
            <p className="text-muted-foreground mb-6">
              The license you&apos;re trying to edit doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
            <Button asChild variant="outline">
              <Link href="/licenses" className="inline-flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Licenses
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            href={`/licenses/${id}`}
            className="inline-flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to License
          </Link>
        </Button>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit License</h1>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <LicenseForm
              license={license}
              organizations={organizations}
              products={products}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
