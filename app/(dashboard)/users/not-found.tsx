import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersNotFound() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">User Management</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-40">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-lg font-medium">Unauthorized Access</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Only Super Admins can access this page.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 