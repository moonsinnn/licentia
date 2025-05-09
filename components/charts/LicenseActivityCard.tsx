"use client";

import { useState } from "react";
import { Activity, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Activation {
  id: string | number;
  is_active: boolean;
  created_at: string;
  domain?: string;
}

interface LicenseActivityCardProps {
  recentActivations: Activation[];
  totalActivations: number;
  activeActivations: number;
  timeRange?: "7days" | "30days" | "90days";
}

export default function LicenseActivityCard({
  recentActivations,
  totalActivations,
  activeActivations,
  timeRange = "7days",
}: LicenseActivityCardProps) {
  const [selectedTab, setSelectedTab] = useState<"overview" | "recent">(
    "overview"
  );

  // Process data for chart
  const chartData = processActivationsForChart(recentActivations);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>License Activity</CardTitle>
          </div>
          <Link href="/licenses/activations">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View All
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <CardDescription>
          {totalActivations > 0
            ? `${activeActivations} active out of ${totalActivations} total activations`
            : "No activations found"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="overview"
          onValueChange={(value) =>
            setSelectedTab(value as "overview" | "recent")
          }
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="h-[180px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorActivations"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) =>
                        formatDateLabel(value, chartData.length)
                      }
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value) => [
                        `${value} activations`,
                        "Activations",
                      ]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString()
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorActivations)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No activity data available
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Active
                </div>
                <div className="text-2xl font-bold">{activeActivations}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Total
                </div>
                <div className="text-2xl font-bold">{totalActivations}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="space-y-4">
              {recentActivations.length > 0 ? (
                <div className="max-h-[220px] overflow-auto space-y-3">
                  {recentActivations.slice(0, 5).map((activation) => (
                    <div
                      key={activation.id}
                      className="flex items-start space-x-3 border-b pb-3"
                    >
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          activation.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {activation.domain ||
                            `License ID: ${activation.license_id || "Unknown"}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activation.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          activation.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {activation.is_active ? "Active" : "Inactive"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No recent activations
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-1">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          Data from the last{" "}
          {timeRange === "7days"
            ? "7 days"
            : timeRange === "30days"
            ? "30 days"
            : "90 days"}
        </div>
      </CardFooter>
    </Card>
  );
}

// Helper function to process activations data for chart
function processActivationsForChart(activations: Activation[]) {
  if (!activations.length) return [];

  // Create a map to count activations by date
  const activationsByDate = new Map<string, number>();

  // Get date range (last 7 days)
  const today = new Date();
  const dates: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    dates.push(dateStr);
    activationsByDate.set(dateStr, 0);
  }

  // Count activations by date
  activations.forEach((activation) => {
    const date = new Date(activation.created_at).toISOString().split("T")[0];
    if (activationsByDate.has(date)) {
      activationsByDate.set(date, (activationsByDate.get(date) || 0) + 1);
    }
  });

  // Convert map to array for chart
  return dates.map((date) => ({
    date,
    count: activationsByDate.get(date) || 0,
  }));
}

// Helper function to format date labels based on number of data points
function formatDateLabel(dateStr: string, dataLength: number) {
  const date = new Date(dateStr);

  // For weekly data, show day of week
  if (dataLength <= 7) {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }

  // For monthly data, show day and month
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
