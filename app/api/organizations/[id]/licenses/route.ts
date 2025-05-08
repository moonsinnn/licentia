import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

// GET /api/organizations/[id]/licenses
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = BigInt((await params).id);

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get all licenses for the organization
    const licenses = await prisma.license.findMany({
      where: { organization_id: id },
      include: {
        product: true,
        license_activations: {
          where: { is_active: true }  // Only include active activations for counting
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Serialize the data to handle BigInt values
    const serializedLicenses = serializeData(licenses);

    return NextResponse.json({
      success: true,
      licenses: serializedLicenses,
    });
  } catch (error) {
    console.error('Error fetching organization licenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization licenses' },
      { status: 500 }
    );
  }
} 