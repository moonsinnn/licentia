import Link from "next/link"
import { ChevronLeft, Building2, Mail, User, Calendar, Key } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"

interface OrganizationViewPageProps {
  params: {
    id: string
  }
}

interface Organization {
  id: string | number;
  name: string;
  contact_name: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
}

interface License {
  id: string | number;
  license_key: string;
  product: {
    id: string | number;
    name: string;
  };
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

async function getOrganizationData(id: string) {
  try {
    const response = await getFromApi<{ organization: Organization }>(`/api/organizations/${id}`);
    return response.organization;
  } catch (error) {
    console.error('Error fetching organization:', error);
    // Return fallback data if API request fails
    return {
      id,
      name: "Organization not found",
      contact_name: "Unknown",
      contact_email: "unknown@example.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

async function getOrganizationLicenses(id: string) {
  try {
    const response = await getFromApi<{ licenses: License[] }>(`/api/organizations/${id}/licenses`);
    return response.licenses;
  } catch (error) {
    console.error('Error fetching organization licenses:', error);
    return [];
  }
}

export default async function OrganizationViewPage({ params }: OrganizationViewPageProps) {
  const orgId = params.id;
  
  // Fetch data in parallel
  const [organization, licenses] = await Promise.all([
    getOrganizationData(orgId),
    getOrganizationLicenses(orgId)
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/organizations" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Organizations
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/organizations/${orgId}/edit`}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Edit Organization
            </Link>
            <Link
              href={`/licenses/new?organization=${orgId}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Add License
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Details
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <User className="h-4 w-4" />
                Contact Name
              </dt>
              <dd>{organization.contact_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Contact Email
              </dt>
              <dd>
                <a href={`mailto:${organization.contact_email}`} className="text-primary hover:underline">
                  {organization.contact_email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created
              </dt>
              <dd>{new Date(organization.created_at).toLocaleString()}</dd>
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
              href={`/licenses/new?organization=${orgId}`}
              className="text-sm text-primary hover:underline"
            >
              Add new license
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
                      Product: {license.product.name}
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
              <p>No licenses found for this organization</p>
              <Link
                href={`/licenses/new?organization=${orgId}`}
                className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Create first license
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 