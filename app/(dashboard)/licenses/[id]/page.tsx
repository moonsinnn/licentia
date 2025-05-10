export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ChevronLeft,
  Key,
  Building2,
  Package,
  Clock,
  Globe,
  Users,
} from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import { LicenseDeleteButton } from "@/components/LicenseDeleteButton";
import ToggleDomainActivationButton from "@/components/ToggleDomainActivationButton";
import ToggleLicenseStatusButton from "@/components/ToggleLicenseStatusButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LicenseViewPageProps {
  params: Promise<{
    id: string;
  }>;
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
    const response = await getFromApi<{ license: License }>(
      `/api/licenses/${id}`
    );
    return response.license;
  } catch (error) {
    console.error("Error fetching license:", error);
    return null;
  }
}

export default async function LicenseViewPage({
  params,
}: LicenseViewPageProps) {
  const { id } = await params;
  const licenseData = await getLicenseData(id);

  if (!licenseData) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <Key className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h1 className="text-xl font-bold mb-2">License not found</h1>
            <p className="text-muted-foreground mb-6">
              The license you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
            <Button asChild variant="outline">
              <Link href="/licenses" className="inline-flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Licenses
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for display
  const activations = licenseData.license_activations || [];
  const currentActivations = activations.filter(
    (act: LicenseActivation) => act.is_active
  ).length;

  // Ensure allowed_domains is an array
  const allowedDomains = Array.isArray(licenseData.allowed_domains)
    ? licenseData.allowed_domains
    : licenseData.allowed_domains
    ? JSON.parse(licenseData.allowed_domains as string)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="px-0 text-muted-foreground hover:text-foreground"
        >
          <Link href="/licenses" className="inline-flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Licenses
          </Link>
        </Button>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">License Details</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/licenses/${id}/edit`}>Edit License</Link>
            </Button>
            <LicenseDeleteButton licenseId={id} variant="button" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Key className="h-5 w-5 text-primary" />
                  License Key
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={licenseData.is_active ? "default" : "destructive"}
                    className={
                      licenseData.is_active
                        ? "bg-green-100 hover:bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {licenseData.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <ToggleLicenseStatusButton
                    licenseId={licenseData.id}
                    licenseKey={licenseData.license_key}
                    isActive={licenseData.is_active}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-lg bg-muted/50 p-3 rounded-md mb-4 overflow-auto">
                {licenseData.license_key}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Organization
                  </h3>
                  <Link
                    href={`/organizations/${licenseData.organization.id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {licenseData.organization.name}
                  </Link>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Product
                  </h3>
                  <Link
                    href={`/products/${licenseData.product.id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {licenseData.product.name}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="h-5 w-5 text-primary" />
                Allowed Domains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allowedDomains && allowedDomains.length > 0 ? (
                  allowedDomains.map((domain: string) => {
                    // Check if this domain has an active activation
                    const domainActivation = activations.find(
                      (act: LicenseActivation) => act.domain === domain
                    );
                    const isActive = domainActivation?.is_active || false;

                    return (
                      <div
                        key={domain}
                        className="bg-muted/50 p-3 rounded-md flex justify-between items-center"
                      >
                        <span className="font-medium">{domain}</span>
                        <ToggleDomainActivationButton
                          licenseKey={licenseData.license_key}
                          domain={domain}
                          isActive={isActive}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No domain restrictions
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-primary" />
                Activations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-muted/50 rounded-md p-3">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Current
                  </h3>
                  <p className="text-2xl font-bold text-foreground">
                    {currentActivations}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-md p-3">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Maximum
                  </h3>
                  <p className="text-2xl font-bold text-foreground">
                    {licenseData.max_activations}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-md font-medium">Recent Activations</h3>
                {activations.length > 0 ? (
                  activations.map((activation: LicenseActivation) => (
                    <div
                      key={activation.id}
                      className="border rounded-md p-3 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{activation.domain}</div>
                        <Badge
                          variant={
                            activation.is_active ? "default" : "destructive"
                          }
                          className={
                            activation.is_active
                              ? "bg-green-100 hover:bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {activation.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid gap-1 text-xs text-muted-foreground">
                        <div>IP: {activation.ip_address}</div>
                        <div
                          className="truncate"
                          title={activation.user_agent || undefined}
                        >
                          UA:{" "}
                          {activation.user_agent
                            ? activation.user_agent.substring(0, 40) + "..."
                            : "Unknown"}
                        </div>
                        <div>
                          Activated:{" "}
                          {new Date(activation.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No activations found
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="h-5 w-5 text-primary" />
                Timing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    Created
                  </h3>
                  <p className="text-foreground font-medium">
                    {new Date(licenseData.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    Expires
                  </h3>
                  <p className="text-foreground font-medium">
                    {licenseData.expires_at
                      ? new Date(licenseData.expires_at).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
