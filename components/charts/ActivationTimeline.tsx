"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivationData {
  date: string;
  count: number;
}

interface ActivationTimelineProps {
  data: ActivationData[];
  title?: string;
  description?: string;
}

export default function ActivationTimeline({
  data,
  title = "Activation Timeline",
  description = "License activations over time",
}: ActivationTimelineProps) {
  const [, setChartType] = useState<"line" | "bar">("line");
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "all">(
    "30days"
  );

  // Filter data based on selected time range
  const filteredData = filterDataByTimeRange(data, timeRange);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={timeRange}
            onValueChange={(value) =>
              setTimeRange(value as "7days" | "30days" | "all")
            }
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="line"
          onValueChange={(value) => setChartType(value as "line" | "bar")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="line">
            <div className="h-[300px] w-full">
              {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        formatDateLabel(value, filteredData.length)
                      }
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${value} activations`,
                        "Activations",
                      ]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString()
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bar">
            <div className="h-[300px] w-full">
              {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        formatDateLabel(value, filteredData.length)
                      }
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${value} activations`,
                        "Activations",
                      ]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString()
                      }
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper function to filter data by time range
function filterDataByTimeRange(
  data: ActivationData[],
  timeRange: "7days" | "30days" | "all"
) {
  if (timeRange === "all" || !data.length) return data;

  const cutoffDate = new Date();
  if (timeRange === "7days") {
    cutoffDate.setDate(cutoffDate.getDate() - 7);
  } else if (timeRange === "30days") {
    cutoffDate.setDate(cutoffDate.getDate() - 30);
  }

  return data.filter((item) => new Date(item.date) >= cutoffDate);
}

// Helper function to format date labels based on number of data points
function formatDateLabel(dateStr: string, dataLength: number) {
  const date = new Date(dateStr);

  // For weekly data, show day of week
  if (dataLength <= 7) {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }

  // For monthly data, show day and month
  if (dataLength <= 31) {
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  }

  // For yearly data, show month and year
  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}
