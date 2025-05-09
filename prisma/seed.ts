import { PrismaClient } from "../lib/generated/prisma";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Helper to generate a license key
function generateLicenseKeySync(): string {
  const segments = Array.from({ length: 4 }, () =>
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
  return segments.join("-");
}

async function main() {
  try {
    console.log("Seeding database...");

    // Hash the password
    const superPassword = "Super@123!";
    const adminPassword = "Admin@123!";
    const hashedSuperPassword = await bcrypt.hash(superPassword, 10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    // Create a super admin user
    const superAdminUser = await prisma.user.upsert({
      where: { email: "super@licenium.com" },
      update: {
        password: hashedSuperPassword,
      },
      create: {
        email: "super@licenium.com",
        name: "Super Admin",
        role: "super_admin",
        password: hashedSuperPassword,
      },
    });
    console.log(
      `Created super admin: ${superAdminUser.name}, password: ${superPassword}`
    );

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@licenium.com" },
      update: {
        password: hashedAdminPassword,
      },
      create: {
        email: "admin@licenium.com",
        name: "Admin",
        role: "admin",
        password: hashedAdminPassword,
      },
    });
    console.log(`Created admin: ${adminUser.name}, password: ${adminPassword}`);

    // Create an organization
    const organization = await prisma.organization.upsert({
      where: { id: BigInt(1) },
      update: {},
      create: {
        name: "Acme Corporation",
        contact_email: "contact@acme.com",
        contact_name: "John Doe",
      },
    });
    console.log(`Created organization: ${organization.name}`);

    // Create a product
    const product = await prisma.product.upsert({
      where: { id: BigInt(1) },
      update: {},
      create: {
        name: "Premium Software",
        description: "Enterprise-grade software solution",
      },
    });
    console.log(`Created product: ${product.name}`);

    // Generate a license key
    const licenseKey = generateLicenseKeySync();

    // Create a license
    const license = await prisma.license.upsert({
      where: { id: BigInt(1) },
      update: {},
      create: {
        license_key: licenseKey,
        organization_id: organization.id,
        product_id: product.id,
        allowed_domains: JSON.stringify(["acme.com", "demo.acme.com"]),
        max_activations: 5,
        is_active: true,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
    });
    console.log(`Created license: ${license.license_key}`);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Error in seed script:", error);
  process.exit(1);
});
