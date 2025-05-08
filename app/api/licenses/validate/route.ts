import { NextRequest, NextResponse } from 'next/server';
import { prisma, validateLicense } from '@/lib/db';

// Fallback validation function if the stored procedure fails
async function validateLicenseFallback(licenseKey: string, domain: string) {
  try {
    // Find the license by key
    const license = await prisma.license.findUnique({
      where: { license_key: licenseKey },
    });
    
    if (!license) {
      return { is_valid: false, message: 'License key not found' };
    }
    
    // Check if license is active
    if (!license.is_active) {
      return { is_valid: false, message: 'License is inactive' };
    }
    
    // Check if license has expired
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return { is_valid: false, message: 'License has expired' };
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
        return { is_valid: false, message: 'Domain not allowed for this license' };
      }
    }
    
    // Check activations count
    const activeActivations = await prisma.licenseActivation.count({
      where: { 
        license_id: license.id,
        is_active: true
      },
    });
    
    if (activeActivations >= license.max_activations) {
      // Check if this domain is already activated
      const existingActivation = await prisma.licenseActivation.findFirst({
        where: {
          license_id: license.id,
          domain: domain,
          is_active: true
        }
      });
      
      if (!existingActivation) {
        return { 
          is_valid: false, 
          message: `Maximum number of activations (${license.max_activations}) reached` 
        };
      }
    }
    
    // All checks passed
    return { is_valid: true, message: 'License is valid for this domain' };
  } catch (error) {
    console.error('Error in fallback validation:', error);
    throw error;
  }
}

// This endpoint is public - no authentication required
export async function POST(request: NextRequest) {
  try {
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
      result = await validateLicense(license_key, domain);
    } catch (error) {
      console.warn('Error using stored procedure for license validation, falling back to direct implementation:', error);
      
      // Fall back to direct implementation
      result = await validateLicenseFallback(license_key, domain);
    }
    
    return NextResponse.json({
      success: true,
      valid: result.is_valid,
      message: result.message
    });
  } catch (error) {
    console.error('Error validating license:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to validate license' 
      },
      { status: 500 }
    );
  }
} 