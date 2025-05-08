import { PrismaClient } from '../lib/generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

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
  interface LicenseKeyResult { license_key: string }
  const result = await executeStoredProcedure<LicenseKeyResult>('generate_license_key', []);
  return result.license_key;
}

/**
 * Validate a license key for a domain
 */
export async function validateLicense(licenseKey: string, domain: string) {
  interface ValidationResult { is_valid: boolean; message: string }
  return executeStoredProcedure<ValidationResult>('validate_license', [licenseKey, domain]);
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