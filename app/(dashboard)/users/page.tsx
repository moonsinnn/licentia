import { checkRole, getFromApi } from "@/lib/api-utils";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCreateButton } from "@/components/UserCreateButton";
import { UserDeleteButton } from "@/components/UserDeleteButton";
import { UserPromoteButton } from "@/components/UserPromoteButton";

// User type definition
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  created_at: string;
};

export default async function UsersPage() {
  try {
    // Check if user has super_admin role
    const authCheck = await checkRole("super_admin");

    if (!authCheck) {
      // Not found will trigger the not-found page
      notFound();
    }

    // Fetch users
    const users = await getFromApi<User[]>("/api/users");

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage administrators and their access levels
            </p>
          </div>

          <UserCreateButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Administrators</CardTitle>
            <CardDescription>
              View and manage all admin users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <Table>
                <TableCaption>List of all administrator accounts</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "super_admin" ? "default" : "outline"
                          }
                        >
                          {user.role === "super_admin"
                            ? "Super Admin"
                            : "Admin"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.role !== "super_admin" && (
                          <UserPromoteButton userId={user.id} />
                        )}
                        <UserDeleteButton userId={user.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error loading users page:", error);
    notFound();
  }
}
