import { NextRequest, NextResponse } from 'next/server';
import { prisma, activateLicense } from '@/lib/db';

// Fallback activation function if the stored procedure fails
async function activateLicenseFallback(
  licenseKey: string, 
  domain: string, 
  ipAddress: string, 
  userAgent: string
) {
  try {
    // Find the license by key
    const license = await prisma.license.findUnique({
      where: { license_key: licenseKey },
    });
    
    if (!license) {
      return { success: false, message: 'License key not found' };
    }
    
    // Check if license is active
    if (!license.is_active) {
      return { success: false, message: 'License is inactive' };
    }
    
    // Check if license has expired
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return { success: false, message: 'License has expired' };
    }
    
    // Check domain allowlist if it's not empty
    const allowedDomains = license.allowed_domains as string[];
    if (allowedDomains && allowedDomains.length > 0) {
      const isDomainInList = allowedDomains.some(
        allowedDomain => {
          // Support wildcard domains
          if (allowedDomain.startsWith('*.')) {
            const suffix = allowedDomain.substring(1); // Remove the *
            return domain.endsWith(suffix);
          }
          return domain === allowedDomain;
        }
      );
      
      if (!isDomainInList) {
        return { success: false, message: 'Domain not allowed for this license' };
      }
    }
    
    // Check if this domain is already activated
    const existingActivation = await prisma.licenseActivation.findFirst({
      where: {
        license_id: license.id,
        domain: domain,
      },
    });
    
    if (existingActivation) {
      // If already active, return success
      if (existingActivation.is_active) {
        return { success: true, message: 'License already activated for this domain' };
      }
      
      // Otherwise reactivate it
      await prisma.licenseActivation.update({
        where: { id: existingActivation.id },
        data: { 
          is_active: true,
          ip_address: ipAddress,
          user_agent: userAgent,
        },
      });
      
      return { success: true, message: 'License reactivated for this domain' };
    }
    
    // Check activations count
    const activeActivations = await prisma.licenseActivation.count({
      where: { 
        license_id: license.id,
        is_active: true
      },
    });
    
    if (activeActivations >= license.max_activations) {
      return { 
        success: false, 
        message: `Maximum number of activations (${license.max_activations}) reached` 
      };
    }
    
    // Create new activation
    await prisma.licenseActivation.create({
      data: {
        license_id: license.id,
        domain,
        ip_address: ipAddress,
        user_agent: userAgent,
        is_active: true,
      },
    });
    
    return { success: true, message: 'License activated successfully' };
  } catch (error) {
    console.error('Error in fallback activation:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey, domain } = body;
    
    // Get IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    // Validate inputs
    if (!licenseKey || !domain) {
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
      result = await activateLicense(licenseKey, domain, ip, userAgent);
    } catch (error) {
      console.warn('Error using stored procedure for license activation, falling back to direct implementation:', error);
      
      // Fall back to direct implementation
      result = await activateLicenseFallback(licenseKey, domain, ip, userAgent);
    }
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.message 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
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