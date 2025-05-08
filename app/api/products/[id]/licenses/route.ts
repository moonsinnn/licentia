import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

// GET /api/products/[id]/licenses
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

    const id = BigInt(params.id);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get all licenses for this product
    const licenses = await prisma.license.findMany({
      where: { product_id: id },
      include: {
        organization: true,
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
    console.error('Error fetching product licenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product licenses' },
      { status: 500 }
    );
  }
} 