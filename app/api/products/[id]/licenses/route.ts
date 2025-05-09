import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';

// GET /api/products/[id]/licenses
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
    const productId = BigInt(id);
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get all licenses for this product
    const licenses = await prisma.license.findMany({
      where: { product_id: productId },
      include: {
        organization: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const serializedLicenses = serializeData(licenses);

    return NextResponse.json({
      success: true,
      licenses: serializedLicenses,
    });
  } catch (error) {
    console.error('Error fetching product licenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch licenses' },
      { status: 500 }
    );
  }
} 