import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';
import { checkRole } from '@/lib/api-utils';

// GET /api/organizations/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const orgId = BigInt(id);

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Serialize the data to handle BigInt values
    const serializedOrganization = serializeData(organization);

    return NextResponse.json({
      success: true,
      organization: serializedOrganization,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const orgId = BigInt(id);
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
      where: { id: orgId },
    });

    if (!existingOrg) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Build update data
    interface UpdateData {
      name?: string;
      contact_email?: string;
      contact_name?: string;
    }
    
    const updateData: UpdateData = {};
    if (name) updateData.name = name;
    if (contact_email) updateData.contact_email = contact_email;
    if (contact_name) updateData.contact_name = contact_name;

    // Update organization
    const organization = await prisma.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    // Serialize the data to handle BigInt values
    const serializedOrganization = serializeData(organization);

    return NextResponse.json({
      success: true,
      organization: serializedOrganization,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check role using the check-role endpoint
    const isAuthorized = await checkRole('super_admin');
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: requires super admin privileges' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const orgId = BigInt(id);

    // Check if there are any licenses for this organization
    const licenses = await prisma.license.findMany({
      where: { organization_id: orgId },
    });

    // Serialize licenses for the check
    const serializedLicenses = serializeData(licenses) as unknown[];

    if (serializedLicenses.length > 0) {
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
      where: { id: orgId },
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