import { NextRequest, NextResponse } from "next/server";
import { prisma, serializeData } from "@/lib/db";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get URL params
    const url = new URL(request.url);
    const licenseId = url.searchParams.get("licenseId");
    const licenseKey = url.searchParams.get("licenseKey");

    // If no licenseId or licenseKey is provided, we'll return all active activations

    let license;

    // If licenseKey is provided, get the license ID from the key
    if (licenseKey) {
      license = await prisma.license.findUnique({
        where: { license_key: licenseKey },
      });

      if (!license) {
        return NextResponse.json(
          { success: false, error: "License not found" },
          { status: 404 }
        );
      }
    }

    // Get license activations
    type WhereClause = {
      is_active: boolean;
      license_id?: bigint;
    };

    const whereClause: WhereClause = { is_active: true };

    if (licenseId) {
      whereClause.license_id = BigInt(licenseId);
    } else if (licenseKey && license) {
      whereClause.license_id = license.id;
    }

    const activations = await prisma.licenseActivation.findMany({
      where: whereClause,
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
    console.error("Error listing license activations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list license activations",
      },
      { status: 500 }
    );
  }
}
