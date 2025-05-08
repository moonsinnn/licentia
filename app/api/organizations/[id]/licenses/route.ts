import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = BigInt(params.id);

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
        license_activations: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      licenses,
    });
  } catch (error) {
    console.error('Error fetching organization licenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization licenses' },
      { status: 500 }
    );
  }
} 