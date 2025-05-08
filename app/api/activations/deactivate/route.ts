import { NextRequest, NextResponse } from 'next/server';
import { prisma, deactivateLicense, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Fallback deactivation function if the stored procedure fails
async function deactivateLicenseFallback(licenseKey: string, domain: string) {
  try {
    // Find the license by key
    const license = await prisma.license.findUnique({
      where: { license_key: licenseKey },
    });
    
    if (!license) {
      return { success: false, message: 'License key not found' };
    }
    
    // Find the activation for this domain
    const activation = await prisma.licenseActivation.findFirst({
      where: {
        license_id: license.id,
        domain: domain,
      },
    });
    
    if (!activation) {
      return { success: false, message: 'No activation found for this domain' };
    }
    
    // If already inactive, just return success
    if (!activation.is_active) {
      return { success: true, message: 'License already deactivated for this domain' };
    }
    
    // Deactivate the license
    const updatedActivation = await prisma.licenseActivation.update({
      where: { id: activation.id },
      data: { is_active: false },
    });
    
    return { success: true, message: 'License deactivated successfully' };
  } catch (error) {
    console.error('Error in fallback deactivation:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { license_key, domain } = body;
    
    // Validate inputs
    if (!license_key || !domain) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'License key and domain are required' 
        },
        { status: 400 }
      );
    }
    
    let result;
    try {
      // Try to use the stored procedure first
      result = await deactivateLicense(license_key, domain);
    } catch (error) {
      console.warn('Error using stored procedure for license deactivation, falling back to direct implementation:', error);
      
      // Fall back to direct implementation
      result = await deactivateLicenseFallback(license_key, domain);
    }
    
    return NextResponse.json({
      success: true,
      deactivated: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('Error deactivating license:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to deactivate license' 
      },
      { status: 500 }
    );
  }
} 