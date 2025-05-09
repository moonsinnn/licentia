import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData, generateLicenseKey } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';

// GET /api/licenses
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

    // Get all licenses
    const licenses = await prisma.license.findMany({
      include: {
        organization: true,
        product: true,
        license_activations: true,
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
    console.error('Error fetching licenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch licenses' },
      { status: 500 }
    );
  }
}

// POST /api/licenses
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
    const { 
      organization_id,
      product_id,
      allowed_domains,
      max_activations,
      expires_at
    } = body;

    // Validate inputs
    if (!organization_id || !product_id || !max_activations) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Organization ID, product ID, and max activations are required' 
        },
        { status: 400 }
      );
    }

    // Validate organization and product exist
    const organization = await prisma.organization.findUnique({
      where: { id: BigInt(organization_id) },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: BigInt(product_id) },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate license key
    const license_key = await generateLicenseKey();

    // Create license
    const license = await prisma.license.create({
      data: {
        license_key,
        organization_id: BigInt(organization_id),
        product_id: BigInt(product_id),
        allowed_domains: allowed_domains || [],
        max_activations: Number(max_activations),
        expires_at: expires_at ? new Date(expires_at) : null,
      },
      include: {
        organization: true,
        product: true,
      },
    });

    // Serialize the data to handle BigInt values
    const serializedLicense = serializeData(license);

    return NextResponse.json({
      success: true,
      license: serializedLicense,
    });
  } catch (error) {
    console.error('Error creating license:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create license' },
      { status: 500 }
    );
  }
} 