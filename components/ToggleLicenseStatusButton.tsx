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

interface ToggleLicenseStatusButtonProps {
  licenseId: string | number;
  licenseKey: string;
  isActive: boolean;
}

export default function ToggleLicenseStatusButton({
  licenseId,
  licenseKey,
  isActive,
}: ToggleLicenseStatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    const action = isActive ? "deactivate" : "activate";

    try {
      setIsLoading(true);

      // First, update the license status
      const response = await fetch(`/api/licenses/${licenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${action} license`);
      }

      // If we're deactivating the license, also deactivate all active domains
      if (isActive) {
        try {
          // Get all active domains for this license
          const activationsResponse = await fetch(
            `/api/activations/active-list?licenseKey=${licenseKey}`
          );

          if (activationsResponse.ok) {
            const activationsData = await activationsResponse.json();
            const activeActivations = activationsData.activations || [];

            // Deactivate each active domain
            for (const activation of activeActivations) {
              await fetch("/api/activations/deactivate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  license_key: licenseKey,
                  domain: activation.domain,
                }),
              });
            }
          }
        } catch (domainError) {
          console.error("Error deactivating domains:", domainError);
          // Continue even if domain deactivation fails
        }
      }

      // Show success toast
      toast.success(
        isActive
          ? `License ${licenseKey} has been deactivated successfully`
          : `License ${licenseKey} has been activated successfully`
      );

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error(`Error ${action}ing license:`, error);
      toast.error(`Failed to ${action} license. Please try again.`);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const dialogTitle = isActive ? "Deactivate License" : "Activate License";
  const dialogDescription = isActive
    ? `Are you sure you want to deactivate the license <strong>${licenseKey}</strong>? This will prevent all domains from using this license and will automatically deactivate all currently active domains.`
    : `Are you sure you want to activate the license <strong>${licenseKey}</strong>? This will allow domains to use this license again.`;

  const buttonText = isActive ? "Deactivate License" : "Activate License";
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
