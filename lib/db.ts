import { PrismaClient } from '../lib/generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

/**
 * Helper function to serialize data with BigInt values to JSON
 * Also properly formats JSON fields
 */
export function serializeData(data: any): any {
  // First, handle BigInt serialization
  const jsonString = JSON.stringify(data, (key, value) => {
    // Handle BigInt values
    if (typeof value === 'bigint') {
      return value.toString();
    }
    
    // Handle JSON string fields that need to be parsed (like allowed_domains)
    if (key === 'allowed_domains' && typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        // If parsing fails, return as is
        console.warn(`Failed to parse allowed_domains: ${value}`, e);
        return value;
      }
    }
    
    return value;
  });
  
  return JSON.parse(jsonString);
}

/**
 * Helper function to execute a stored procedure that returns a result
 */
export async function executeStoredProcedure<T>(
  procedureName: string,
  params: any[]
): Promise<T> {
  const paramPlaceholders = params.map(() => '?').join(', ');
  const query = `CALL ${procedureName}(${paramPlaceholders})`;
  
  const result = await prisma.$queryRawUnsafe(query, ...params) as T[];
  return result[0] as T;
}

/**
 * Generate a unique license key
 */
export async function generateLicenseKey(): Promise<string> {
  // Generate a random license key (avoiding the stored procedure due to collation issues)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Generate four groups of four characters
  let licenseKey = '';
  for (let group = 0; group < 4; group++) {
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      licenseKey += chars[randomIndex];
    }
    if (group < 3) licenseKey += '-'; // Add hyphen between groups
  }
  
  // Ensure the key is unique by checking the database
  const existingLicense = await prisma.license.findUnique({
    where: { license_key: licenseKey },
  });
  
  if (existingLicense) {
    // Try again if the key already exists
    return generateLicenseKey();
  }
  
  return licenseKey;
}

/**
 * Validate a license key for a domain
 */
export async function validateLicense(licenseKey: string, domain: string) {
  // Skip the stored procedure and directly implement validation logic
  // This avoids collation issues entirely
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
    console.error('Error validating license:', error);
    throw error;
  }
}

/**
 * Activate a license for a domain
 */
export async function activateLicense(
  licenseKey: string,
  domain: string,
  ipAddress: string,
  userAgent: string
) {
  interface ActivationResult { success: boolean; message: string }
  return executeStoredProcedure<ActivationResult>('activate_license', [
    licenseKey,
    domain,
    ipAddress,
    userAgent,
  ]);
}

/**
 * Deactivate a license for a domain
 */
export async function deactivateLicense(licenseKey: string, domain: string) {
  interface DeactivationResult { success: boolean; message: string }
  return executeStoredProcedure<DeactivationResult>('deactivate_license', [licenseKey, domain]);
}

/**
 * Check if a domain is allowed for a license
 */
export async function isDomainAllowed(licenseId: bigint, domain: string) {
  interface DomainCheckResult { is_allowed: boolean; message: string }
  return executeStoredProcedure<DomainCheckResult>('is_domain_allowed', [licenseId, domain]);
} 