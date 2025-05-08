import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get URL params
    const url = new URL(request.url);
    const licenseId = url.searchParams.get('licenseId');
    const licenseKey = url.searchParams.get('licenseKey');
    
    // Validate inputs
    if (!licenseId && !licenseKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Either licenseId or licenseKey is required' 
        },
        { status: 400 }
      );
    }
    
    let license;
    
    // If licenseKey is provided, get the license ID from the key
    if (licenseKey) {
      license = await prisma.license.findUnique({
        where: { license_key: licenseKey },
      });
      
      if (!license) {
        return NextResponse.json(
          { success: false, error: 'License not found' },
          { status: 404 }
        );
      }
    }
    
    // Get license activations
    const whereClause = licenseId 
      ? { license_id: BigInt(licenseId) }
      : { license_id: license!.id };
      
    const activations = await prisma.licenseActivation.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      include: {
        license: {
          select: {
            license_key: true
          }
        }
      }
    });
    
    // Serialize the data to handle BigInt values
    const serializedActivations = serializeData(activations);
    
    return NextResponse.json({
      success: true,
      activations: serializedActivations,
    });
  } catch (error) {
    console.error('Error listing license activations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to list license activations' 
      },
      { status: 500 }
    );
  }
} 