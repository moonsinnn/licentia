import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"
import OrganizationForm from "@/components/OrganizationForm"

interface OrganizationEditPageProps {
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

export default async function OrganizationEditPage({ params }: OrganizationEditPageProps) {
  const orgId = params.id;
  const organization = await getOrganizationData(orgId);

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href={`/organizations/${orgId}`} 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Organization
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit Organization</h1>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <OrganizationForm organization={organization} />
        </div>
      </div>
    </div>
  )
} 