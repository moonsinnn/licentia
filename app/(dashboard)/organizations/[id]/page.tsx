import Link from "next/link"
import { ChevronLeft, Building2, Mail, User, Calendar, Key } from "lucide-react"

interface OrganizationViewPageProps {
  params: {
    id: string
  }
}

export default function OrganizationViewPage({ params }: OrganizationViewPageProps) {
  // We would fetch the organization details by ID
  const orgId = params.id
  
  // Mock data for display purposes
  const orgData = {
    id: orgId,
    name: "Acme Corporation",
    contact_name: "John Doe",
    contact_email: "john@acmecorp.com",
    created_at: "2023-09-01T00:00:00Z",
    updated_at: "2023-09-01T00:00:00Z",
  }

  // Mock licenses for this organization
  const licenses = [
    {
      id: "1",
      license_key: "ABCD-1234-EFGH-5678",
      product: {
        id: "1",
        name: "Analytics Dashboard Pro",
      },
      is_active: true,
      expires_at: null,
      created_at: "2023-09-15T00:00:00Z",
    },
    {
      id: "2",
      license_key: "WXYZ-9876-MNOP-5432",
      product: {
        id: "2",
        name: "CRM Suite",
      },
      is_active: true,
      expires_at: "2025-06-30T00:00:00Z",
      created_at: "2023-10-20T00:00:00Z",
    }
  ]

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
          <h1 className="text-3xl font-bold tracking-tight">{orgData.name}</h1>
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
              <dd>{orgData.contact_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Contact Email
              </dt>
              <dd>
                <a href={`mailto:${orgData.contact_email}`} className="text-primary hover:underline">
                  {orgData.contact_email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created
              </dt>
              <dd>{new Date(orgData.created_at).toLocaleString()}</dd>
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
          
          {licenses.length > 0 ? (
            <div className="space-y-4">
              {licenses.map(license => (
                <div key={license.id} className="border rounded-md p-4">
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