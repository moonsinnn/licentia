import { NextResponse } from "next/server";
import { prisma, serializeData } from "@/lib/db";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all license activations
    const activations = await prisma.licenseActivation.findMany({
      orderBy: { created_at: "desc" },
      include: {
        license: {
          select: {
            license_key: true,
          },
        },
      },
    });

    // Serialize the data to handle BigInt values
    const serializedActivations = serializeData(activations);

    return NextResponse.json({
      success: true,
      activations: serializedActivations,
    });
  } catch (error) {
    console.error("Error listing all license activations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list license activations",
      },
      { status: 500 }
    );
  }
}
