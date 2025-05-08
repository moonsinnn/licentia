import { NextRequest, NextResponse } from 'next/server';
import { prisma, activateLicense, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

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
    
    // Get IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
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
    
    // Call the activation function
    const result = await activateLicense(license_key, domain, ip, userAgent);
    
    return NextResponse.json({
      success: true,
      activated: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('Error activating license:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to activate license' 
      },
      { status: 500 }
    );
  }
} 