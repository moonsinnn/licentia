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

interface DeactivateActivationButtonProps {
  licenseKey: string;
  domain: string;
}

export default function DeactivateActivationButton({
  licenseKey,
  domain,
}: DeactivateActivationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDeactivate = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/activations/deactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ license_key: licenseKey, domain }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Failed to deactivate license activation"
        );
      }

      // Show success toast
      toast.success(`Domain ${domain} has been deactivated successfully`);

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error deactivating license activation:", error);
      toast.error("Failed to deactivate license activation. Please try again.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isLoading}>
          Deactivate
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate License Activation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate this license activation for
            domain <strong>{domain}</strong>? This will prevent the domain from
            using the license until reactivated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeactivate} disabled={isLoading}>
            {isLoading ? "Deactivating..." : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
