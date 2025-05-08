import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/products/[id]
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

    const id = BigInt((await params).id);

    // Get product
    const product = await prisma.product.findUnique({
      where: { id },
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

    const id = BigInt((await params).id);
    const body = await request.json();
    const { name, description } = body;

    // Validate inputs
    if (!name && description === undefined) {
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
      where: { id },
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
    if (description !== undefined) updateData.description = description;

    // Update product
    const product = await prisma.product.update({
      where: { id },
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

    // Only super_admin can delete products
    if (session.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: requires super admin privileges' },
        { status: 403 }
      );
    }

    const id = BigInt((await params).id);

    // Check if there are any licenses for this product
    const licenses = await prisma.license.findMany({
      where: { product_id: id },
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
      where: { id },
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