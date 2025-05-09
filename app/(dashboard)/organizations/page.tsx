export const dynamic = "force-dynamic";

import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import { OrganizationDeleteButton } from "@/components/OrganizationDeleteButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Organization {
  id: string | number;
  name: string;
  contact_email: string;
  contact_name: string;
}

async function getOrganizations(): Promise<Organization[]> {
  try {
    const data = await getFromApi<{ organizations: Organization[] }>(
      "/api/organizations"
    );
    return data.organizations || [];
  } catch (error) {
    console.error("Error fetching organizations:", error);
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
        <Button asChild>
          <Link href="/organizations/new">
            <Plus className="h-4 w-4" />
            <Building2 className="h-4 w-4" />
            New Organization
          </Link>
        </Button>
      </div>

      <Card className="border shadow-sm">
        <div className="divide-y">
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <div
                key={String(org.id)}
                className="flex items-center justify-between p-4"
              >
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-semibold text-foreground">{org.name}</h3>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm text-muted-foreground">
                        {org.contact_email}
                      </span>
                    </div>
                    {org.contact_name && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">Contact:</span>
                        <span className="text-sm text-muted-foreground">
                          {org.contact_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/organizations/${org.id}`}>View</Link>
                  </Button>
                  <OrganizationDeleteButton organizationId={org.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium mb-1">
                No organizations found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first organization to get started.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/organizations/new">
                  <Plus className="h-4 w-4 mr-1" />
                  New Organization
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
