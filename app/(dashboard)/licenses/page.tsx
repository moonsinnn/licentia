export const dynamic = "force-dynamic";

import Link from "next/link";
import { Key, Plus } from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import { LicenseDeleteButton } from "@/components/LicenseDeleteButton";
import ToggleLicenseStatusButtonCompact from "@/components/ToggleLicenseStatusButtonCompact";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface License {
  id: string | number;
  license_key: string;
  organization: {
    id: string | number;
    name: string;
  };
  product: {
    id: string | number;
    name: string;
  };
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

async function getLicenses(): Promise<License[]> {
  try {
    const data = await getFromApi<{ licenses: License[] }>("/api/licenses");
    return data.licenses || [];
  } catch (error) {
    console.error("Error fetching licenses:", error);
    return [];
  }
}

export default async function LicensesPage() {
  const licenses = await getLicenses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Licenses</h1>
          <p className="text-muted-foreground">
            Manage licenses for your products and organizations
          </p>
        </div>
        <Button asChild>
          <Link href="/licenses/new">
            <Plus className="h-4 w-4" />
            <Key className="h-4 w-4" />
            New License
          </Link>
        </Button>
      </div>

      <Card className="border shadow-sm">
        <div className="divide-y">
          {licenses.length > 0 ? (
            licenses.map((license) => (
              <div
                key={String(license.id)}
                className="flex items-center justify-between p-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {license.license_key}
                    </h3>
                    <Badge
                      variant={license.is_active ? "default" : "destructive"}
                      className={
                        license.is_active
                          ? "bg-green-100 hover:bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {license.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">Product:</span>
                      <span className="text-sm text-muted-foreground">
                        {license.product.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">Organization:</span>
                      <span className="text-sm text-muted-foreground">
                        {license.organization.name}
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
                <div className="flex items-center gap-2">
                  <Link
                    href={`/licenses/${license.id}`}
                    className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground px-3 py-1.5 text-sm font-medium shadow-xs hover:bg-secondary/80 transition-colors"
                  >
                    View
                  </Link>
                  <ToggleLicenseStatusButtonCompact
                    licenseId={license.id}
                    licenseKey={license.license_key}
                    isActive={license.is_active}
                  />
                  <LicenseDeleteButton licenseId={license.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Key className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium mb-1">No licenses found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first license to get started.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/licenses/new">
                  <Plus className="h-4 w-4 mr-1" />
                  New License
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
