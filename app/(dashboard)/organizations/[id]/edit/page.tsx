export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import OrganizationForm from "@/components/OrganizationForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrganizationEditPageProps {
  params: Promise<{
    id: string;
  }>;
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
    const response = await getFromApi<{ organization: Organization }>(
      `/api/organizations/${id}`
    );
    return response.organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
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

export default async function OrganizationEditPage({
  params,
}: OrganizationEditPageProps) {
  const { id } = await params;
  const organization = await getOrganizationData(id);

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
            href={`/organizations/${id}`}
            className="inline-flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Organization
          </Link>
        </Button>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Edit Organization
        </h1>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <OrganizationForm organization={organization} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
