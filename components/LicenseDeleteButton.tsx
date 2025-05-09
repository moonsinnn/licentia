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

interface LicenseDeleteButtonProps {
  licenseId: string | number
  variant?: "icon" | "button"
  className?: string
}

export function LicenseDeleteButton({ 
  licenseId, 
  variant = "icon",
  className = ""
}: LicenseDeleteButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle delete license
  async function handleDelete() {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/licenses/${licenseId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete license")
      }
      
      toast.success("License deleted successfully")
      setIsOpen(false)
      
      // Redirect to licenses list if we're on the detail page
      if (window.location.pathname.includes(`/licenses/${licenseId}`)) {
        router.push('/licenses')
      } else {
        router.refresh() // Just refresh the page to remove the deleted license
      }
    } catch (error) {
      console.error("Error deleting license:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete license")
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
          <AlertDialogTitle>Delete License</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            license and remove all associated data, including all license activations.
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
