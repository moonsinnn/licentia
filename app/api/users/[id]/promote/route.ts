import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRole } from "@/lib/api-utils";

// PUT - Promote a user to super_admin
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the request
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: Only super admins can promote users" },
        { status: 401 }
      );
    }

    // Check if the user is authenticated and is a super_admin
    const authCheck = await checkRole("super_admin");
    if (!authCheck) {
      return NextResponse.json(
        { error: "Unauthorized: Only super admins can promote users" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = id;

    // Validate userId is a number
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    try {
      // Find the target user
      const targetUser = await prisma.user.findUnique({
        where: { id: BigInt(userId) },
      });

      if (!targetUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if the user is already a super_admin
      if (targetUser.role === "super_admin") {
        return NextResponse.json(
          { error: "User is already a super admin" },
          { status: 400 }
        );
      }

      // Promote the user to super_admin
      const updatedUser = await prisma.user.update({
        where: { id: BigInt(userId) },
        data: { role: "super_admin" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
        },
      });

      // Return the updated user with id converted to string
      return NextResponse.json({
        ...updatedUser,
        id: updatedUser.id.toString(),
      });
    } catch (dbError) {
      console.error("Database error promoting user:", dbError);
      return NextResponse.json(
        { error: "Failed to promote user in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error promoting user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to promote user";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
