import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';
import { checkRole } from '@/lib/api-utils';

// GET /api/licenses/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const licenseId = BigInt(id);

    // Get license with related data
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: {
        organization: true,
        product: true,
        license_activations: true,
      },
    });

    if (!license) {
      return NextResponse.json(
        { success: false, error: 'License not found' },
        { status: 404 }
      );
    }

    // Serialize the data to handle BigInt values
    const serializedLicense = serializeData(license);

    return NextResponse.json({
      success: true,
      license: serializedLicense,
    });
  } catch (error) {
    console.error('Error fetching license:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch license' },
      { status: 500 }
    );
  }
}

// PUT /api/licenses/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check role using the check-role endpoint
    const isAuthorized = await checkRole('admin');
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const licenseId = BigInt(id);
    const body = await request.json();
    const { 
      allowed_domains,
      max_activations,
      is_active,
      expires_at
    } = body;

    // Check if license exists
    const existingLicense = await prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!existingLicense) {
      return NextResponse.json(
        { success: false, error: 'License not found' },
        { status: 404 }
      );
    }

    // Build update data
    interface UpdateData {
      allowed_domains?: string[];
      max_activations?: number;
      is_active?: boolean;
      expires_at?: Date | null;
    }
    
    const updateData: UpdateData = {};
    if (allowed_domains !== undefined) updateData.allowed_domains = allowed_domains;
    if (max_activations !== undefined) updateData.max_activations = Number(max_activations);
    if (is_active !== undefined) updateData.is_active = !!is_active;
    if (expires_at !== undefined) updateData.expires_at = expires_at ? new Date(expires_at) : null;

    // Update license
    const license = await prisma.license.update({
      where: { id: licenseId },
      data: updateData,
      include: {
        organization: true,
        product: true,
        license_activations: true,
      },
    });

    // Serialize the data to handle BigInt values
    const serializedLicense = serializeData(license);

    return NextResponse.json({
      success: true,
      license: serializedLicense,
    });
  } catch (error) {
    console.error('Error updating license:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update license' },
      { status: 500 }
    );
  }
}

// DELETE /api/licenses/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check role using the check-role endpoint
    const isAuthorized = await checkRole('admin');
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const licenseId = BigInt(id);

    // Check if license exists
    const existingLicense = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { license_activations: true },
    });

    if (!existingLicense) {
      return NextResponse.json(
        { success: false, error: 'License not found' },
        { status: 404 }
      );
    }

    // Delete all license activations first
    if (existingLicense.license_activations.length > 0) {
      await prisma.licenseActivation.deleteMany({
        where: { license_id: licenseId },
      });
    }

    // Delete license
    await prisma.license.delete({
      where: { id: licenseId },
    });

    return NextResponse.json({
      success: true,
      message: 'License deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting license:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete license' },
      { status: 500 }
    );
  }
} 