import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';

// GET /api/organizations
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all organizations
    const organizations = await prisma.organization.findMany({
      orderBy: { created_at: 'desc' },
    });

    // Serialize the data to handle BigInt values
    const serializedOrganizations = serializeData(organizations);

    return NextResponse.json({
      success: true,
      organizations: serializedOrganizations,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

// POST /api/organizations
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, contact_email, contact_name } = body;

    // Validate inputs
    if (!name || !contact_email || !contact_name) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, contact email, and contact name are required' 
        },
        { status: 400 }
      );
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        contact_email,
        contact_name,
      },
    });

    // Serialize the data to handle BigInt values
    const serializedOrganization = serializeData(organization);

    return NextResponse.json({
      success: true,
      organization: serializedOrganization,
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create organization' },
      { status: 500 }
    );
  }
} 