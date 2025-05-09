"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"

interface OrganizationDeleteButtonProps {
  organizationId: string | number
  variant?: "icon" | "button"
  className?: string
}

export function OrganizationDeleteButton({ 
  organizationId, 
  variant = "icon",
  className = ""
}: OrganizationDeleteButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle delete organization
  async function handleDelete() {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/organizations/${organizationId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete organization")
      }
      
      toast.success("Organization deleted successfully")
      setIsOpen(false)
      
      // Redirect to organizations list if we're on the detail page
      if (window.location.pathname.includes(`/organizations/${organizationId}`)) {
        router.push('/organizations')
      } else {
        router.refresh() // Just refresh the page to remove the deleted organization
      }
    } catch (error) {
      console.error("Error deleting organization:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete organization")
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="outline"
            size="icon"
            className={`text-destructive hover:text-destructive ${className}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            className={className}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            organization and remove all associated data.
            
            Note: You cannot delete an organization that has active licenses.
            Please delete all licenses for this organization first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isDeleting}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
