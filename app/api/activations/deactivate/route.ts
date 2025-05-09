import { NextRequest, NextResponse } from 'next/server';
import { deactivateLicense } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';

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
    
    // Call the deactivation function
    const result = await deactivateLicense(license_key, domain);
    
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