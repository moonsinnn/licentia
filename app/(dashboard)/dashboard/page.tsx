export const dynamic = "force-dynamic";

import { Building2, Package, Key, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getFromApi } from "@/lib/api-utils";
import LicenseActivityCard from "@/components/charts/LicenseActivityCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Organization {
  id: string | number;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
}

interface Activation {
  id: string | number;
  is_active: boolean;
  created_at: string;
  domain?: string;
  license_id?: string | number;
}

interface License {
  id: string | number;
  license_key: string;
  organization: Organization;
  product: Product;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  license_activations: Activation[];
}

async function getCountData() {
  try {
    // Fetch all data in parallel
    const [orgsData, productsData, licensesData, activationsData] =
      await Promise.all([
        getFromApi<{ organizations: Organization[] }>("/api/organizations"),
        getFromApi<{ products: Product[] }>("/api/products"),
        getFromApi<{ licenses: License[] }>("/api/licenses"),
        getFromApi<{ activations: Activation[] }>("/api/activations/all"),
      ]);

    const organizations = orgsData.organizations || [];
    const products = productsData.products || [];
    const licenses = licensesData.licenses || [];
    const allActivations = activationsData.activations || [];

    // Count active licenses
    const activeLicenses = licenses.filter((license) => license.is_active);

    // Get recent activations (in the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivationsList = allActivations.filter((act: Activation) => {
      const activationDate = new Date(act.created_at);
      return activationDate >= sevenDaysAgo;
    });

    // Count active activations
    const activeActivations = allActivations.filter(
      (act: Activation) => act.is_active
    ).length;

    // Count recent activations (in the last 7 days) - legacy method
    const recentActivations = licenses.reduce(
      (acc: number, license: License) => {
        return (
          acc +
          (license.license_activations?.filter((act: Activation) => {
            const activationDate = new Date(act.created_at);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return activationDate >= sevenDaysAgo && act.is_active;
          }).length || 0)
        );
      },
      0
    );

    return {
      organizationsCount: organizations.length,
      productsCount: products.length,
      activeLicensesCount: activeLicenses.length,
      recentActivationsCount: recentActivations,
      recentActivations: recentActivationsList,
      totalActivations: allActivations.length,
      activeActivations,
      recentLicenses: licenses.slice(0, 5),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      organizationsCount: 0,
      productsCount: 0,
      activeLicensesCount: 0,
      recentActivationsCount: 0,
      recentActivations: [],
      totalActivations: 0,
      activeActivations: 0,
      recentLicenses: [] as License[],
    };
  }
}

export default async function DashboardPage() {
  const {
    organizationsCount,
    productsCount,
    activeLicensesCount,
    recentActivationsCount,
    recentLicenses,
    recentActivations,
    totalActivations,
    activeActivations,
  } = await getCountData();

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your license management
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Organizations"
          value={organizationsCount.toString()}
          description="Total organizations"
          icon={Building2}
          href="/organizations"
        />
        <DashboardCard
          title="Products"
          value={productsCount.toString()}
          description="Registered products"
          icon={Package}
          href="/products"
        />
        <DashboardCard
          title="Licenses"
          value={activeLicensesCount.toString()}
          description="Active licenses"
          icon={Key}
          href="/licenses"
        />
        <DashboardCard
          title="Activations"
          value={recentActivationsCount.toString()}
          description="Recent activations"
          icon={Activity}
          href="/licenses/activations"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Recent Licenses</CardTitle>
              </div>
              <Link href="/licenses">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <CardDescription>Recently created license keys</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLicenses.length > 0 ? (
              <div className="space-y-3">
                {recentLicenses.map((license) => (
                  <div
                    key={String(license.id)}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {license.license_key}
                        </span>
                        <Badge
                          variant={license.is_active ? "default" : "outline"}
                          className="text-xs"
                        >
                          {license.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {license.product.name} - {license.organization.name}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(license.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                No licenses found
              </div>
            )}
          </CardContent>
        </Card>

        <LicenseActivityCard
          recentActivations={recentActivations}
          totalActivations={totalActivations}
          activeActivations={activeActivations}
          timeRange="7days"
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Link>
  );
}
