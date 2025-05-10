"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Organization {
  id: string | number;
  name: string;
}

interface Product {
  id: string | number;
  name: string;
}

export default function NewLicensePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domains, setDomains] = useState<string[]>([]);
  const [domainInput, setDomainInput] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both APIs in parallel
        const [orgsResponse, productsResponse] = await Promise.all([
          fetch("/api/organizations"),
          fetch("/api/products"),
        ]);

        // Check if any response failed
        if (!orgsResponse.ok) {
          const errorData = await orgsResponse.json();
          throw new Error(
            errorData.error || `Organizations API error: ${orgsResponse.status}`
          );
        }

        if (!productsResponse.ok) {
          const errorData = await productsResponse.json();
          throw new Error(
            errorData.error || `Products API error: ${productsResponse.status}`
          );
        }

        // Parse the responses
        const orgsData = await orgsResponse.json();
        const productsData = await productsResponse.json();

        // Update state with the data
        setOrganizations(orgsData.organizations || []);
        setProducts(productsData.products || []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load organizations and products"
        );
      }
    }

    fetchData();
  }, []);

  function addDomain() {
    if (domainInput && !domains.includes(domainInput)) {
      setDomains([...domains, domainInput]);
      setDomainInput("");
    }
  }

  function removeDomain(domain: string) {
    setDomains(domains.filter((d) => d !== domain));
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
      expires_at: (formData.get("expires_at") as string) || null,
    };

    try {
      // Call the API to create the license
      const response = await fetch("/api/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      setError(
        error instanceof Error ? error.message : "Failed to create license"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="px-0 text-muted-foreground hover:text-foreground"
        >
          <Link href="/licenses" className="inline-flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Licenses
          </Link>
        </Button>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">New License</h1>
        <p className="text-muted-foreground">
          Generate a new license key for a product
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 shadow-sm">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <Card className="shadow-md border rounded-lg overflow-hidden">
        <CardContent className="pt-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="organization_id">Organization</Label>
                <Select name="organization_id" required>
                  <SelectTrigger id="organization_id" className="w-full">
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={String(org.id)} value={String(org.id)}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_id">Product</Label>
                <Select name="product_id" required>
                  <SelectTrigger id="product_id" className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={String(product.id)}
                        value={String(product.id)}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Allowed Domains</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="example.com"
                  className="flex-1"
                />
                <Button type="button" onClick={addDomain} className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {domains.map((domain) => (
                  <Badge
                    key={domain}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {domain}
                    <button
                      type="button"
                      onClick={() => removeDomain(domain)}
                      className="ml-2 text-sm text-secondary-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max_activations">Max Activations</Label>
                <Input
                  id="max_activations"
                  name="max_activations"
                  type="number"
                  required
                  min="1"
                  defaultValue="1"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                <Input
                  id="expires_at"
                  name="expires_at"
                  type="date"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <Button asChild variant="outline" size="lg" className="px-6">
                <Link href="/licenses">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="px-6"
              >
                {isSubmitting ? "Creating..." : "Generate License"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
