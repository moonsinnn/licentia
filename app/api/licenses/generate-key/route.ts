import { NextResponse } from "next/server";
import { generateLicenseKey } from "@/lib/db";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate a license key (function now uses JS implementation)
    const licenseKey = await generateLicenseKey();

    return NextResponse.json({
      success: true,
      licenseKey,
    });
  } catch (error) {
    console.error("Error generating license key:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate license key",
      },
      { status: 500 }
    );
  }
}
