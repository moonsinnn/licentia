import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"
import LicenseForm from "@/components/LicenseForm"

interface LicenseEditPageProps {
  params: {
    id: string
  }
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
    const response = await getFromApi<{ license: License }>(`/api/licenses/${id}`);
    return response.license;
  } catch (error) {
    console.error('Error fetching license:', error);
    return null;
  }
}

async function getOrganizations() {
  try {
    const response = await getFromApi<{ organizations: Organization[] }>('/api/organizations');
    return response.organizations || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await getFromApi<{ products: Product[] }>('/api/products');
    return response.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function LicenseEditPage({ params }: LicenseEditPageProps) {
  const licenseId = params.id;
  
  // Fetch data in parallel
  const [license, organizations, products] = await Promise.all([
    getLicenseData(licenseId),
    getOrganizations(),
    getProducts()
  ]);

  if (!license) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">License not found</h1>
        <p className="mt-2 text-muted-foreground">The license you're trying to edit doesn't exist or you don't have permission to view it.</p>
        <Link 
          href="/licenses" 
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Licenses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href={`/licenses/${licenseId}`} 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to License
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit License</h1>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <LicenseForm 
            license={license} 
            organizations={organizations}
            products={products}
          />
        </div>
      </div>
    </div>
  )
} 