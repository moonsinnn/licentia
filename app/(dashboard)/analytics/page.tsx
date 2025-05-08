import { BarChart, DollarSign, Clock, Activity } from "lucide-react"

export default function AnalyticsPage() {
  // Mock data
  const stats = {
    totalLicenses: 24,
    activeLicenses: 18,
    totalActivations: 35,
    activeActivations: 28,
    totalRevenue: 4820,
    averageLicenseAge: 67, // days
  }

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
          value={stats.totalLicenses}
          description={`${stats.activeLicenses} active`}
          icon={<BarChart className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="License Activations"
          value={stats.totalActivations}
          description={`${stats.activeActivations} active`}
          icon={<Activity className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Average License Age"
          value={`${stats.averageLicenseAge}`}
          description="days"
          icon={<Clock className="h-5 w-5 text-primary" />}
        />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Advanced Analytics Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-2">
            We're working on advanced analytics features including:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
              Detailed usage graphs and trends
            </li>
            <li className="flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
              Geographic distribution of license activations
            </li>
            <li className="flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
              License utilization analytics
            </li>
            <li className="flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
              Revenue forecasting and financial insights
            </li>
            <li className="flex items-center">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
              Custom reporting with export functionality
            </li>
          </ul>
        </div>
        <div className="flex items-center p-6 pt-0">
          <div className="text-xs text-muted-foreground">Available in the next update</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">License Growth</h3>
          <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-800 rounded-md">
            <p className="text-muted-foreground">Charts coming soon</p>
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Activation Map</h3>
          <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-800 rounded-md">
            <p className="text-muted-foreground">Geographic visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
} 