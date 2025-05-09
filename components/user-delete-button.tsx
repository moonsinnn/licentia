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

interface UserDeleteButtonProps {
  userId: string
}

export function UserDeleteButton({ userId }: UserDeleteButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle delete user
  async function handleDelete() {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete user")
      }
      
      toast.success("User deleted successfully")
      setIsOpen(false)
      router.refresh() // Refresh the page to remove the deleted user
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete user")
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            user account and remove all associated data.
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