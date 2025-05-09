"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ToggleDomainActivationButtonProps {
  licenseKey: string;
  domain: string;
  isActive: boolean;
}

export default function ToggleDomainActivationButton({
  licenseKey,
  domain,
  isActive,
}: ToggleDomainActivationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    const action = isActive ? "deactivate" : "activate";

    try {
      setIsLoading(true);

      const endpoint = isActive
        ? "/api/activations/deactivate"
        : "/api/activations/activate";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ license_key: licenseKey, domain }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${action} domain`);
      }

      // Show success toast
      toast.success(
        isActive
          ? `Domain ${domain} has been deactivated successfully`
          : `Domain ${domain} has been activated successfully`
      );

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error(`Error ${action}ing domain:`, error);
      toast.error(`Failed to ${action} domain. Please try again.`);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const dialogTitle = isActive ? "Deactivate Domain" : "Activate Domain";
  const dialogDescription = isActive
    ? `Are you sure you want to deactivate the domain <strong>${domain}</strong>? This will prevent the domain from using the license until reactivated.`
    : `Are you sure you want to activate the domain <strong>${domain}</strong>? This will allow the domain to use the license.`;

  const buttonText = isActive ? "Deactivate" : "Activate";
  const loadingText = isActive ? "Deactivating..." : "Activating...";

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={isActive ? "destructive" : "default"}
          size="sm"
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription
            dangerouslySetInnerHTML={{ __html: dialogDescription }}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle} disabled={isLoading}>
            {isLoading ? loadingText : buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
