import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateLicenseKey } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check role - only admins can generate keys
    const userRole = session.user.role;
    if (!userRole || (userRole !== 'admin' && userRole !== 'super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Generate a license key (function now uses JS implementation)
    let licenseKey = await generateLicenseKey();
    
    return NextResponse.json({ 
      success: true, 
      licenseKey
    });
  } catch (error) {
    console.error('Error generating license key:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate license key' 
      },
      { status: 500 }
    );
  }
} 