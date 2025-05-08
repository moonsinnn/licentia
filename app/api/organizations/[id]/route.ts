import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/organizations/[id]
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

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}

// PUT /api/organizations/[id]
export async function PUT(
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
    const body = await request.json();
    const { name, contact_email, contact_name } = body;

    // Validate inputs
    if (!name && !contact_email && !contact_name) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'At least one field to update is required' 
        },
        { status: 400 }
      );
    }

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
    });

    if (!existingOrg) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (contact_email) updateData.contact_email = contact_email;
    if (contact_name) updateData.contact_name = contact_name;

    // Update organization
    const organization = await prisma.organization.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/[id]
export async function DELETE(
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

    // Only super_admin can delete organizations
    if (session.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: requires super admin privileges' },
        { status: 403 }
      );
    }

    const id = BigInt(params.id);

    // Check if there are any licenses for this organization
    const licenses = await prisma.license.findMany({
      where: { organization_id: id },
    });

    if (licenses.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete organization with existing licenses. Delete the licenses first.'
        },
        { status: 400 }
      );
    }

    // Delete organization
    await prisma.organization.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete organization' },
      { status: 500 }
    );
  }
} 