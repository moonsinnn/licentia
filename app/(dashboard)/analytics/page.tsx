import { BarChart, Clock, Activity, TrendingUp } from "lucide-react";
import { getFromApi } from "@/lib/api-utils";
import ActivationTimeline from "@/components/charts/ActivationTimeline";
import LicenseStatusChart from "@/components/charts/LicenseStatusChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface AnalyticsData {
  overview: {
    totalLicenses: number;
    activeLicenses: number;
    totalActivations: number;
    activeActivations: number;
    averageLicenseAge: number;
  };
  trends: {
    licensesByMonth: Array<{ month: string; count: number }>;
    activationsByDate: Array<{ date: string; count: number }>;
  };
}

async function getAnalyticsData() {
  try {
    const data = await getFromApi<{ analytics: AnalyticsData }>(
      "/api/analytics"
    );
    return data.analytics;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    // Return default values if API call fails
    return {
      overview: {
        totalLicenses: 0,
        activeLicenses: 0,
        totalActivations: 0,
        activeActivations: 0,
        averageLicenseAge: 0,
      },
      trends: {
        licensesByMonth: [],
        activationsByDate: [],
      },
    };
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();
  const {
    totalLicenses,
    activeLicenses,
    totalActivations,
    activeActivations,
    averageLicenseAge,
  } = analytics.overview;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          License metrics and performance insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Licenses"
          value={totalLicenses}
          description={`${activeLicenses} active`}
          icon={<BarChart className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="License Activations"
          value={totalActivations}
          description={`${activeActivations} active`}
          icon={<Activity className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Average License Age"
          value={`${averageLicenseAge}`}
          description="days"
          icon={<Clock className="h-5 w-5 text-primary" />}
        />
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">
              License Analytics Overview
            </CardTitle>
          </div>
          <CardDescription>
            Track your license metrics and performance insights with our
            interactive charts and visualizations.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <p className="text-sm text-muted-foreground">
            Monitor license activations, usage patterns, and distribution to
            optimize your license management. Use the interactive charts below
            to filter data by time range and visualize trends.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <LicenseStatusChart
          active={activeLicenses}
          inactive={totalLicenses - activeLicenses}
          title="License Status"
          description="Distribution of active and inactive licenses"
        />
        <ActivationTimeline
          data={analytics.trends.activationsByDate}
          title="Activation Timeline"
          description="License activations over time"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
