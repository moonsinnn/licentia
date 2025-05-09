import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRole } from "@/lib/api-utils";

// DELETE - Delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the request
    const session = await getServerSession(nextAuthOptions);

    // Check if the user is authenticated and is a super_admin
    const authCheck = await checkRole("super_admin");
    if (!authCheck) {
      return NextResponse.json(
        { error: "Unauthorized: Only super admins can delete users" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = id;

    // Validate userId is a number
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Prevent deleting self
    if (userId === session?.user?.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    try {
      // Check if user exists
      const userExists = await prisma.user.findUnique({
        where: { id: BigInt(userId) },
        select: { id: true },
      });

      if (!userExists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Delete the user
      await prisma.user.delete({
        where: { id: BigInt(userId) },
      });
    } catch (dbError) {
      console.error("Database error deleting user:", dbError);
      return NextResponse.json(
        { error: "Failed to delete user from database" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
