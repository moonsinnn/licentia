export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Building2, Plus } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"

interface Organization {
  id: string | number;
  name: string;
  contact_email: string;
  contact_name: string;
}

async function getOrganizations(): Promise<Organization[]> {
  try {
    const data = await getFromApi<{ organizations: Organization[] }>('/api/organizations');
    return data.organizations || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your client organizations
          </p>
        </div>
        <Link
          href="/organizations/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="mr-1 h-4 w-4" />
          <Building2 className="mr-2 h-4 w-4" />
          New Organization
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-medium">Your Organizations</h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search organizations..."
              className="w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div className="divide-y">
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <div key={String(org.id)} className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-medium">{org.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {org.contact_email}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/organizations/${org.id}`}
                    className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No organizations found. Create your first organization to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 