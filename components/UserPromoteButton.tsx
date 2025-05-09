"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface UserPromoteButtonProps {
  userId: string
}

export function UserPromoteButton({ userId }: UserPromoteButtonProps) {
  const router = useRouter()
  const [isPromoting, setIsPromoting] = useState(false)

  // Handle promote user to super_admin
  async function handlePromote() {
    if (isPromoting) return
    
    setIsPromoting(true)
    
    try {
      const response = await fetch(`/api/users/${userId}/promote`, {
        method: "PUT",
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to promote user")
      }
      
      toast.success("User promoted to Super Admin")
      router.refresh() // Refresh the page to update user roles
    } catch (error) {
      console.error("Error promoting user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to promote user")
    } finally {
      setIsPromoting(false)
    }
  }
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handlePromote}
      disabled={isPromoting}
      title="Promote to Super Admin"
      className="mr-2"
    >
      <Shield className="h-4 w-4" />
    </Button>
  )
} 