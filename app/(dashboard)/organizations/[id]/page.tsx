export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ChevronLeft,
  Building2,
  Mail,
  User,
  Calendar,
  Key,
  Plus,
} from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import { OrganizationDeleteButton } from "@/components/OrganizationDeleteButton";
import { LicenseDeleteButton } from "@/components/LicenseDeleteButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrganizationViewPageProps {
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

async function getOrganizationLicenses(id: string) {
  try {
    const response = await getFromApi<{ licenses: License[] }>(
      `/api/organizations/${id}/licenses`
    );
    return response.licenses;
  } catch (error) {
    console.error("Error fetching organization licenses:", error);
    return [];
  }
}

export default async function OrganizationViewPage({
  params,
}: OrganizationViewPageProps) {
  const { id } = await params;

  // Fetch data in parallel
  const [organization, licenses] = await Promise.all([
    getOrganizationData(id),
    getOrganizationLicenses(id),
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
          <h1 className="text-3xl font-bold tracking-tight">
            {organization.name}
          </h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/organizations/${id}/edit`}>Edit Organization</Link>
            </Button>
            <OrganizationDeleteButton organizationId={id} variant="button" />
            <Button asChild>
              <Link href={`/licenses/new?organization=${id}`}>
                <Plus className="h-4 w-4" />
                Add License
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5 text-primary" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="grid gap-1">
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Contact Name
                </dt>
                <dd className="text-foreground font-medium">
                  {organization.contact_name}
                </dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Contact Email
                </dt>
                <dd>
                  <a
                    href={`mailto:${organization.contact_email}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {organization.contact_email}
                  </a>
                </dd>
              </div>
              <div className="grid gap-1">
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Created
                </dt>
                <dd className="text-foreground">
                  {new Date(organization.created_at).toLocaleString()}
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
                <Link href={`/licenses/new?organization=${id}`}>
                  <Plus className="h-3.5 w-3.5" />
                  Add new license
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
                        <span className="text-sm font-medium">Product:</span>
                        <span className="text-sm text-muted-foreground">
                          {license.product.name}
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
                  This organization doesn't have any licenses yet.
                </p>
                <Button asChild>
                  <Link href={`/licenses/new?organization=${id}`}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create first license
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
