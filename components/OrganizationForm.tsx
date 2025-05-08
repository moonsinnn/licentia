"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Organization {
  id: string | number;
  name: string;
  contact_name: string;
  contact_email: string;
  created_at?: string;
  updated_at?: string;
}

interface OrganizationFormProps {
  organization?: Organization;
}

export default function OrganizationForm({ organization }: OrganizationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>({
    name: organization?.name || '',
    contact_name: organization?.contact_name || '',
    contact_email: organization?.contact_email || '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const url = organization 
        ? `/api/organizations/${organization.id}` 
        : `/api/organizations`
      
      const response = await fetch(url, {
        method: organization ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save organization')
      }

      // Redirect after successful submission
      if (organization) {
        // If editing, redirect to organization view page
        router.push(`/organizations/${organization.id}`)
      } else {
        // If creating, redirect to organizations list
        router.push('/organizations')
      }
      
      // Refresh the page data
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
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
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Organization Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter organization name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="contact_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Contact Name
          </label>
          <input
            id="contact_name"
            name="contact_name"
            type="text"
            value={formData.contact_name}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter contact person's name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="contact_email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Contact Email
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter contact email"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => organization ? router.push(`/organizations/${organization.id}`) : router.push('/organizations')}
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
          {isLoading ? 'Saving...' : organization ? 'Update Organization' : 'Create Organization'}
        </button>
      </div>
    </form>
  )
} 