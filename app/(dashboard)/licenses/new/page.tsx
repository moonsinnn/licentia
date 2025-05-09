"use client"

export const dynamic = 'force-dynamic'


import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Organization {
  id: string | number;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
}

export default function NewLicensePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [domains, setDomains] = useState<string[]>([])
  const [domainInput, setDomainInput] = useState("")
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch both APIs in parallel
        const [orgsResponse, productsResponse] = await Promise.all([
          fetch('/api/organizations'),
          fetch('/api/products')
        ]);
        
        // Check if any response failed
        if (!orgsResponse.ok) {
          const errorData = await orgsResponse.json();
          throw new Error(errorData.error || `Organizations API error: ${orgsResponse.status}`);
        }
        
        if (!productsResponse.ok) {
          const errorData = await productsResponse.json();
          throw new Error(errorData.error || `Products API error: ${productsResponse.status}`);
        }

        // Parse the responses
        const orgsData = await orgsResponse.json();
        const productsData = await productsResponse.json();

        // Update state with the data
        setOrganizations(orgsData.organizations || []);
        setProducts(productsData.products || []);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load organizations and products');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  function addDomain() {
    if (domainInput && !domains.includes(domainInput)) {
      setDomains([...domains, domainInput])
      setDomainInput("")
    }
  }

  function removeDomain(domain: string) {
    setDomains(domains.filter(d => d !== domain))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear any previous errors

    const formData = new FormData(event.currentTarget);
    const data = {
      organization_id: formData.get("organization_id") as string,
      product_id: formData.get("product_id") as string,
      allowed_domains: domains,
      max_activations: parseInt(formData.get("max_activations") as string, 10),
      expires_at: formData.get("expires_at") as string || null,
    };

    try {
      // Call the API to create the license
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      
      
      // Redirect to licenses page
      router.push("/licenses");
      router.refresh();
    } catch (error) {
      console.error("Error creating license:", error);
      setError(error instanceof Error ? error.message : 'Failed to create license');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/licenses" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Licenses
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">New License</h1>
        <p className="text-muted-foreground">
          Generate a new license key for a product
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="rounded-md border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="organization_id"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Organization
              </label>
              <select
                id="organization_id"
                name="organization_id"
                required
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={String(org.id)} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="product_id"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Product
              </label>
              <select
                id="product_id"
                name="product_id"
                required
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={String(product.id)} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Allowed Domains
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="example.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                onClick={addDomain}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {domains.map((domain) => (
                <div 
                  key={domain}
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {domain}
                  <button
                    type="button"
                    onClick={() => removeDomain(domain)}
                    className="ml-2 text-sm text-secondary-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="max_activations"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Max Activations
              </label>
              <input
                id="max_activations"
                name="max_activations"
                type="number"
                required
                min="1"
                defaultValue="1"
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="expires_at"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Expiration Date (Optional)
              </label>
              <input
                id="expires_at"
                name="expires_at"
                type="date"
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/licenses"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Generate License"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 