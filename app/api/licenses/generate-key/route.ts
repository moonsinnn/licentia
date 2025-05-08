import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateLicenseKey } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Helper function to generate a license key if the stored procedure fails
function generateRandomLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Generate four groups of four characters
  let key = '';
  for (let group = 0; group < 4; group++) {
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      key += chars[randomIndex];
    }
    if (group < 3) key += '-'; // Add hyphen between groups
  }
  
  return key;
}

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
    
    let licenseKey;
    try {
      // Try to use the stored procedure first
      licenseKey = await generateLicenseKey();
    } catch (error) {
      console.warn('Error using stored procedure for license key generation, falling back to JS implementation:', error);
      
      // Fall back to JavaScript implementation
      licenseKey = generateRandomLicenseKey();
      
      // Ensure the key is unique by checking the database
      let isUnique = false;
      while (!isUnique) {
        const existingLicense = await prisma.license.findUnique({
          where: { license_key: licenseKey },
        });
        
        if (!existingLicense) {
          isUnique = true;
        } else {
          licenseKey = generateRandomLicenseKey();
        }
      }
    }
    
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