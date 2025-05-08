import { NextRequest, NextResponse } from 'next/server';
import { prisma, serializeData } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

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

    // Get all licenses
    const licenses = await prisma.license.findMany({
      include: {
        license_activations: true
      }
    });

    // Calculate metrics
    const totalLicenses = licenses.length;
    const activeLicenses = licenses.filter(license => license.is_active).length;
    
    // Calculate total and active activations
    let totalActivations = 0;
    let activeActivations = 0;
    
    licenses.forEach(license => {
      if (license.license_activations) {
        totalActivations += license.license_activations.length;
        activeActivations += license.license_activations.filter(act => act.is_active).length;
      }
    });
    
    // Calculate average license age in days
    const now = new Date();
    let totalAgeDays = 0;
    
    licenses.forEach(license => {
      const createdAt = new Date(license.created_at);
      const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      totalAgeDays += ageInDays;
    });
    
    const averageLicenseAge = totalLicenses > 0 ? Math.round(totalAgeDays / totalLicenses) : 0;
    
    // Get monthly license count for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const licensesByMonth = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM 
        licenses
      WHERE 
        created_at >= ${sixMonthsAgo}
      GROUP BY 
        DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY 
        month ASC
    `;
    
    // Get activation count by date for the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activationsByDate = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
        COUNT(*) as count
      FROM 
        license_activations
      WHERE 
        created_at >= ${thirtyDaysAgo}
      GROUP BY 
        DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY 
        date ASC
    `;

    // Organize the data
    const analyticsData = {
      overview: {
        totalLicenses,
        activeLicenses,
        totalActivations,
        activeActivations,
        averageLicenseAge
      },
      trends: {
        licensesByMonth: serializeData(licensesByMonth),
        activationsByDate: serializeData(activationsByDate)
      }
    };

    return NextResponse.json({
      success: true,
      analytics: serializeData(analyticsData)
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 