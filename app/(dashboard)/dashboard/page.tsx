import { Building2, Package, Key, Activity } from "lucide-react"
import Link from "next/link"
import { getFromApi } from "@/lib/api-utils"

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
    const [
      orgsData,
      productsData,
      licensesData
    ] = await Promise.all([
      getFromApi<{ organizations: Organization[] }>('/api/organizations'),
      getFromApi<{ products: Product[] }>('/api/products'),
      getFromApi<{ licenses: License[] }>('/api/licenses')
    ]);

    const organizations = orgsData.organizations || [];
    const products = productsData.products || [];
    const licenses = licensesData.licenses || [];

    // Count active licenses
    const activeLicenses = licenses.filter(license => license.is_active);
    
    // Count recent activations (in the last 7 days)
    const recentActivations = licenses.reduce((acc: number, license: License) => {
      return acc + (license.license_activations?.filter((act: Activation) => {
        const activationDate = new Date(act.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return activationDate >= sevenDaysAgo && act.is_active;
      }).length || 0);
    }, 0);

    return {
      organizationsCount: organizations.length,
      productsCount: products.length,
      activeLicensesCount: activeLicenses.length,
      recentActivationsCount: recentActivations,
      recentLicenses: licenses.slice(0, 5),
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      organizationsCount: 0,
      productsCount: 0,
      activeLicensesCount: 0,
      recentActivationsCount: 0,
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
  } = await getCountData();

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
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-medium">Recent Licenses</h2>
          {recentLicenses.length > 0 ? (
            <div className="space-y-2">
              {recentLicenses.map((license) => (
                <div key={String(license.id)} className="border-b pb-2 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{license.license_key}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(license.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {license.product.name} - {license.organization.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No licenses found
            </div>
          )}
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-medium">License Activity</h2>
          <div className="text-sm text-muted-foreground">
            {recentActivationsCount > 0 ? 
              `${recentActivationsCount} ${recentActivationsCount === 1 ? 'activation' : 'activations'} in the last 7 days` :
              'No recent activations found'}
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