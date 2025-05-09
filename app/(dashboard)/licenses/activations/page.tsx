import Link from "next/link"
import { getFromApi } from "@/lib/api-utils"

export const dynamic = 'force-dynamic'

interface LicenseActivation {
  id: string | number;
  license_id: string | number;
  license: {
    license_key: string;
  };
  domain: string;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

async function getLicenseActivations(): Promise<LicenseActivation[]> {
  try {
    const data = await getFromApi<{ activations: LicenseActivation[] }>('/api/activations/list');
    return data.activations || [];
  } catch (error) {
    console.error('Error fetching license activations:', error);
    return [];
  }
}

export default async function LicenseActivationsPage() {
  const activations = await getLicenseActivations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">License Activations</h1>
          <p className="text-muted-foreground">
            Track and manage all license activations
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-medium">Active Instances</h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search activations..."
              className="w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div className="divide-y">
          {activations.length > 0 ? (
            activations.map((activation) => (
              <div key={String(activation.id)} className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{activation.domain}</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      activation.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activation.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-col mt-1">
                    <span className="text-sm text-muted-foreground">
                      License Key: {activation.license.license_key}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      IP: {activation.ip_address}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Activated: {new Date(activation.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/licenses/${activation.license_id}`}
                    className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    View License
                  </Link>
                  {activation.is_active && (
                    <button
                      className="inline-flex items-center justify-center rounded-md bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground shadow transition-colors hover:bg-destructive/90"
                      onClick={() => {
                        // Client-side deactivation would go here
                      }}
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No activations found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 