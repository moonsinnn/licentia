import { Suspense } from "react"
import { Building2, Package, Key, Activity } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your license management
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Organizations"
          value="--"
          description="Total organizations"
          icon={Building2}
          href="/organizations"
        />
        <DashboardCard
          title="Products"
          value="--"
          description="Registered products"
          icon={Package}
          href="/products"
        />
        <DashboardCard
          title="Licenses"
          value="--"
          description="Active licenses"
          icon={Key}
          href="/licenses"
        />
        <DashboardCard
          title="Activations"
          value="--"
          description="Recent activations"
          icon={Activity}
          href="/licenses/activations"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-medium">Recent Licenses</h2>
          <div className="text-sm text-muted-foreground">
            Connect to Supabase to display real data
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-medium">License Activity</h2>
          <div className="text-sm text-muted-foreground">
            Connect to Supabase to display real data
          </div>
        </div>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string
  description: string
  icon: React.ElementType
  href: string
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
  )
} 