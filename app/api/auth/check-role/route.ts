import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(nextAuthOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get URL params
    const url = new URL(request.url);
    const requiredRole = url.searchParams.get('role');
    
    if (!requiredRole) {
      return NextResponse.json({
        success: true,
        user: {
          id: session.user?.id,
          name: session.user?.name,
          email: session.user?.email,
          role: session.user?.role,
        },
        authorized: true,
      });
    }
    
    // Check if user has the required role
    const isAuthorized = 
      // Super admin has access to everything
      session.user?.role === 'super_admin' || 
      // Match exact role
      session.user?.role === requiredRole;
    
    return NextResponse.json({
      success: true,
      user: {
        id: session.user?.id,
        name: session.user?.name,
        email: session.user?.email,
        role: session.user?.role,
      },
      authorized: isAuthorized,
    });
  } catch (error) {
    console.error('Error checking role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check user role' },
      { status: 500 }
    );
  }
} 