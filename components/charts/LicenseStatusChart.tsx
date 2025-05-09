"use client"

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LicenseStatusData {
  name: string;
  value: number;
  color: string;
}

interface LicenseStatusChartProps {
  active: number;
  inactive: number;
  expired?: number;
  title?: string;
  description?: string;
}

export default function LicenseStatusChart({ 
  active, 
  inactive, 
  expired = 0,
  title = "License Status", 
  description = "Distribution of license statuses" 
}: LicenseStatusChartProps) {
  // Prepare data for the pie chart
  const data: LicenseStatusData[] = [
    { name: "Active", value: active, color: "hsl(var(--success))" },
    { name: "Inactive", value: inactive, color: "hsl(var(--muted))" }
  ]
  
  // Add expired licenses if provided
  if (expired > 0) {
    data.push({ name: "Expired", value: expired, color: "hsl(var(--destructive))" })
  }
  
  // Filter out zero values
  const filteredData = data.filter(item => item.value > 0)
  
  // Calculate total
  const total = filteredData.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} licenses`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Active</div>
            <div className="text-2xl font-bold">{active}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Inactive</div>
            <div className="text-2xl font-bold">{inactive}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{total}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
