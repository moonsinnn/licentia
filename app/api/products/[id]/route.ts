import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';
import { checkRole } from '@/lib/api-utils';

// GET /api/products/[id]
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

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Serialize the data to handle BigInt values
    const serializedProduct = serializeData(product);

    return NextResponse.json({
      success: true,
      product: serializedProduct,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]
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
    const isAuthorized = await checkRole('super_admin');
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: requires super admin privileges' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const productId = BigInt(id);
    const body = await request.json();
    const { name, description } = body;

    // Validate inputs
    if (!name && !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'At least one field to update is required' 
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Build update data
    interface UpdateData {
      name?: string;
      description?: string;
    }
    
    const updateData: UpdateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    // Serialize the data to handle BigInt values
    const serializedProduct = serializeData(product);

    return NextResponse.json({
      success: true,
      product: serializedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
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
    const productId = BigInt(id);

    // Check if there are any licenses for this product
    const licenses = await prisma.license.findMany({
      where: { product_id: productId },
    });

    // Serialize licenses for the check
    const serializedLicenses = serializeData(licenses) as unknown[];

    if (serializedLicenses.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete product with existing licenses. Delete the licenses first.'
        },
        { status: 400 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 