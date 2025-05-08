"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"

interface ActivationFormProps {
  licenseKey: string
}

export default function ActivationForm({ licenseKey }: ActivationFormProps) {
  const [domain, setDomain] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [action, setAction] = useState<"activate" | "deactivate">("activate")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/activations/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          license_key: licenseKey,
          domain,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult({
          success: action === "activate" ? data.activated : data.deactivated,
          message: data.message,
        })
        if (data.success) {
          setDomain("")
        }
      } else {
        setResult({
          success: false,
          message: data.error || "An error occurred",
        })
      }
    } catch (error) {
      console.error('Activation error:', error);
      setResult({
        success: false,
        message: "Failed to connect to server",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Manage License Activation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium mb-1">
            Domain
          </label>
          <input
            id="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter the domain name to activate or deactivate this license
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => setAction("activate")}
              className={`px-4 py-2 rounded-md font-medium w-full ${
                action === "activate"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-slate-100 text-slate-800 border border-slate-200"
              }`}
            >
              Activate
            </button>
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => setAction("deactivate")}
              className={`px-4 py-2 rounded-md font-medium w-full ${
                action === "deactivate"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-slate-100 text-slate-800 border border-slate-200"
              }`}
            >
              Deactivate
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
        >
          {isLoading ? "Processing..." : action === "activate" ? "Activate License" : "Deactivate License"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 p-3 rounded-md ${
            result.success
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-start gap-2">
            {result.success ? (
              <Check className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <X className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <div>{result.message}</div>
          </div>
        </div>
      )}
    </div>
  )
}