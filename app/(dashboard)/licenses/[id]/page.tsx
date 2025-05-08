import Link from "next/link"
import { ChevronLeft, Key, Building2, Package, Clock, Users, Globe } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"
import ActivationForm from "@/components/ActivationForm"

interface LicenseViewPageProps {
  params: {
    id: string
  }
}

interface LicenseActivation {
  id: string | number;
  license_id: string | number;
  domain: string;
  ip_address: string;
  user_agent: string | null | undefined;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface License {
  id: string | number;
  license_key: string;
  organization_id: string | number;
  product_id: string | number;
  allowed_domains: string[] | string;
  max_activations: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  organization: { id: string | number; name: string };
  product: { id: string | number; name: string };
  license_activations: LicenseActivation[];
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

export default async function LicenseViewPage({ params }: LicenseViewPageProps) {
  const licenseId = (await params).id;
  const licenseData = await getLicenseData(licenseId);
  
  if (!licenseData) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">License not found</h1>
        <p className="mt-2 text-muted-foreground">The license you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
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
  
  // Format data for display
  const activations = licenseData.license_activations || [];
  const currentActivations = activations.filter((act: LicenseActivation) => act.is_active).length;
  
  // Ensure allowed_domains is an array
  const allowedDomains = Array.isArray(licenseData.allowed_domains) 
    ? licenseData.allowed_domains 
    : (licenseData.allowed_domains ? JSON.parse(licenseData.allowed_domains as string) : []);

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/licenses" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Licenses
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">License Details</h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/licenses/${licenseId}/edit`}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Edit License
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Key className="h-5 w-5" />
                License Key
              </h2>
              <span className={`inline-flex h-6 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                licenseData.is_active 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {licenseData.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="font-mono text-lg bg-slate-50 dark:bg-slate-800 p-3 rounded-md mb-4">
              {licenseData.license_key}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  Organization
                </h3>
                <Link 
                  href={`/organizations/${licenseData.organization.id}`}
                  className="text-primary hover:underline"
                >
                  {licenseData.organization.name}
                </Link>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Product
                </h3>
                <Link 
                  href={`/products/${licenseData.product.id}`}
                  className="text-primary hover:underline"
                >
                  {licenseData.product.name}
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Allowed Domains
            </h2>
            <div className="space-y-2">
              {allowedDomains && allowedDomains.length > 0 ? (
                allowedDomains.map((domain: string) => (
                  <div key={domain} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
                    {domain}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No domain restrictions</p>
              )}
            </div>
          </div>
          
          {/* Add activation form */}
          <ActivationForm licenseKey={licenseData.license_key} />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Activations
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Current</h3>
                <p className="text-2xl font-bold">{currentActivations}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Maximum</h3>
                <p className="text-2xl font-bold">{licenseData.max_activations}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-md font-medium">Recent Activations</h3>
              {activations.length > 0 ? (
                activations.map((activation: LicenseActivation) => (
                  <div key={activation.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{activation.domain}</div>
                      <span className={`inline-flex h-5 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        activation.is_active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {activation.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>IP: {activation.ip_address}</div>
                      <div className="truncate" title={activation.user_agent || undefined}>
                        UA: {activation.user_agent ? activation.user_agent.substring(0, 40) + '...' : 'Unknown'}
                      </div>
                      <div>
                        Activated: {new Date(activation.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No activations found</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timing Information
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{new Date(licenseData.created_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Expires</h3>
                <p>{licenseData.expires_at ? new Date(licenseData.expires_at).toLocaleString() : "Never"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 