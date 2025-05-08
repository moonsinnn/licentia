"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface Organization {
  id: string | number;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
}

interface License {
  id: string | number;
  license_key: string;
  organization_id: string | number;
  product_id: string | number;
  organization?: Organization;
  product?: Product;
  allowed_domains: string[];
  max_activations: number;
  is_active: boolean;
  expires_at: string | null;
  created_at?: string;
  updated_at?: string;
}

interface LicenseFormProps {
  license?: License;
  products?: Product[];
  organizations?: Organization[];
}

export default function LicenseForm({ license, products = [], organizations = [] }: LicenseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [domain, setDomain] = useState('')
  const [formData, setFormData] = useState<Partial<License>>({
    license_key: license?.license_key || '',
    organization_id: license?.organization_id || '',
    product_id: license?.product_id || '',
    allowed_domains: license?.allowed_domains || [],
    max_activations: license?.max_activations || 1,
    is_active: license?.is_active !== undefined ? license.is_active : true,
    expires_at: license?.expires_at || null,
  })
  const [error, setError] = useState<string | null>(null)

  // Load organization and product data if editing
  useEffect(() => {
    if (license) {
      setFormData(prevData => ({
        ...prevData,
        organization_id: license.organization_id,
        product_id: license.product_id,
      }))
    }
  }, [license])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'max_activations') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddDomain = () => {
    if (!domain) return
    
    if (formData.allowed_domains?.includes(domain)) {
      setError('Domain already added')
      return
    }
    
    setFormData(prev => ({
      ...prev,
      allowed_domains: [...(prev.allowed_domains || []), domain]
    }))
    setDomain('')
  }

  const handleRemoveDomain = (domainToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      allowed_domains: (prev.allowed_domains || []).filter(d => d !== domainToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const url = license 
        ? `/api/licenses/${license.id}` 
        : `/api/licenses`
      
      const response = await fetch(url, {
        method: license ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save license')
      }

      // Redirect after successful submission
      if (license) {
        // If editing, redirect to license view page
        router.push(`/licenses/${license.id}`)
      } else {
        // If creating, redirect to the newly created license page or licenses list
        router.push(data.license?.id ? `/licenses/${data.license.id}` : '/licenses')
      }
      
      // Refresh the page data
      router.refresh()
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {license && (
          <div className="space-y-2">
            <label htmlFor="license_key" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              License Key
            </label>
            <input
              id="license_key"
              name="license_key"
              type="text"
              value={formData.license_key}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled
            />
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="organization_id" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Organization
          </label>
          <select
            id="organization_id"
            name="organization_id"
            value={formData.organization_id}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={String(org.id)} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="product_id" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Product
          </label>
          <select
            id="product_id"
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={String(product.id)} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="allowed_domains" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Allowed Domains
          </label>
          <div className="flex space-x-2">
            <input
              id="domain_input"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleAddDomain}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.allowed_domains?.map((domain) => (
              <div key={domain} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm">
                {domain}
                <button
                  type="button"
                  onClick={() => handleRemoveDomain(domain)}
                  className="ml-1 h-4 w-4 rounded-full text-slate-500 hover:text-slate-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {formData.allowed_domains?.length === 0 && (
              <p className="text-xs text-muted-foreground">No domains added. If left empty, license will work on any domain.</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="max_activations" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Maximum Activations
          </label>
          <input
            id="max_activations"
            name="max_activations"
            type="number"
            min="1"
            value={formData.max_activations}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="expires_at" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Expiration Date (optional)
          </label>
          <input
            id="expires_at"
            name="expires_at"
            type="date"
            value={formData.expires_at ? formData.expires_at.toString().split('T')[0] : ''}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            License is active
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => license ? router.push(`/licenses/${license.id}`) : router.push('/licenses')}
          className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : license ? 'Update License' : 'Create License'}
        </button>
      </div>
    </form>
  )
} 