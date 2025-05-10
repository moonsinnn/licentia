export const dynamic = "force-dynamic";

import { checkRole, getFromApi } from "@/lib/api-utils";
import { notFound } from "next/navigation";
import { Shield, User } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
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
        <div className="flex items-center justify-between">
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

        <Card className="border shadow-sm">
          <div className="divide-y">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium mb-1">No users found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first administrator to get started.
                </p>
                <UserCreateButton />
              </div>
            ) : (
              <>
                <div className="p-3">
                  <Table>
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
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "super_admin"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                user.role === "super_admin"
                                  ? "bg-primary hover:bg-primary text-primary-foreground"
                                  : ""
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
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error loading users page:", error);
    notFound();
  }
}
