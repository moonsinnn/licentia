import Link from "next/link"
import { Key, Plus } from "lucide-react"
import { getFromApi } from "@/lib/api-utils"

interface License {
  id: string | number;
  license_key: string;
  organization: {
    id: string | number;
    name: string;
  };
  product: {
    id: string | number;
    name: string;
  };
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

async function getLicenses(): Promise<License[]> {
  try {
    const data = await getFromApi<{ licenses: License[] }>('/api/licenses');
    return data.licenses || [];
  } catch (error) {
    console.error('Error fetching licenses:', error);
    return [];
  }
}

export default async function LicensesPage() {
  const licenses = await getLicenses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Licenses</h1>
          <p className="text-muted-foreground">
            Manage software licenses for your products
          </p>
        </div>
        <Link
          href="/licenses/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="mr-1 h-4 w-4" />
          <Key className="mr-2 h-4 w-4" />
          New License
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-medium">Your Licenses</h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search licenses..."
              className="w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div className="divide-y">
          {licenses.length > 0 ? (
            licenses.map((license) => (
              <div key={String(license.id)} className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3 className="font-medium">{license.license_key}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Product: {license.product.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Organization: {license.organization.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      license.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {license.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {license.expires_at 
                        ? `Expires: ${new Date(license.expires_at).toLocaleDateString()}` 
                        : 'Expires: Never'}
                    </span>
                  </div>
                </div>
                <div>
                  <Link
                    href={`/licenses/${license.id}`}
                    className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No licenses found. Create your first license to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 