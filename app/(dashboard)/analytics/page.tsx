import { BarChart, Clock, Activity } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"

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
    const data = await getFromApi<{ analytics: AnalyticsData }>('/api/analytics');
    return data.analytics;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return default values if API call fails
    return {
      overview: {
        totalLicenses: 0,
        activeLicenses: 0,
        totalActivations: 0,
        activeActivations: 0,
        averageLicenseAge: 0
      },
      trends: {
        licensesByMonth: [],
        activationsByDate: []
      }
    };
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();
  const { totalLicenses, activeLicenses, totalActivations, activeActivations, averageLicenseAge } = analytics.overview;

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

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Advanced Analytics Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-2">
            We&apos;re working on advanced analytics features including:
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
            {analytics.trends.licensesByMonth.length > 0 ? (
              <div className="w-full h-full p-4">
                <div className="flex justify-between mb-2">
                  {analytics.trends.licensesByMonth.map((item, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {item.month.split('-')[1]}
                    </div>
                  ))}
                </div>
                <div className="flex items-end h-32 space-x-2">
                  {analytics.trends.licensesByMonth.map((item, index) => {
                    const maxCount = Math.max(...analytics.trends.licensesByMonth.map(i => i.count));
                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary rounded-t" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs mt-1">{item.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Recent Activations</h3>
          <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-800 rounded-md">
            {analytics.trends.activationsByDate.length > 0 ? (
              <div className="w-full h-full p-4">
                <div className="flex justify-between mb-2">
                  {analytics.trends.activationsByDate.slice(-7).map((item, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {item.date.split('-')[2]}
                    </div>
                  ))}
                </div>
                <div className="flex items-end h-32 space-x-2">
                  {analytics.trends.activationsByDate.slice(-7).map((item, index) => {
                    const maxCount = Math.max(...analytics.trends.activationsByDate.slice(-7).map(i => i.count));
                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary rounded-t" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs mt-1">{item.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
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