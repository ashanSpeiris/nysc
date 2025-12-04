import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { cache } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Check authentication
  const auth = await requireAuth(request);
  if (auth.error) {
    return auth.response;
  }

  try {
    // Try to get from cache first
    const cached = await cache.get('volunteer_stats');
    if (cached) {
      return NextResponse.json(cached);
    }

    // Get all volunteers
    const volunteers = await prisma.volunteer.findMany({
      select: {
        volunteerType: true,
        district: true,
        ageRange: true,
        sex: true,
        duration: true,
        status: true,
        createdAt: true,
      },
    });

    type VolunteerStats = {
      volunteerType: string;
      district: string;
      ageRange: string;
      sex: string;
      duration: string;
      status: string;
      createdAt: Date;
    };

    const totalVolunteers = volunteers.length;

    // Calculate statistics

    // 1. Volunteer Type Distribution
    const volunteerTypeCount: Record<string, number> = {};
    volunteers.forEach((v: VolunteerStats) => {
      volunteerTypeCount[v.volunteerType] =
        (volunteerTypeCount[v.volunteerType] || 0) + 1;
    });
    const volunteerTypeStats = Object.entries(volunteerTypeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // 2. District Distribution
    const districtCount: Record<string, number> = {};
    volunteers.forEach((v: VolunteerStats) => {
      districtCount[v.district] = (districtCount[v.district] || 0) + 1;
    });
    const districtStats = Object.entries(districtCount)
      .map(([district, count]) => ({ district, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 districts

    // 3. Age Distribution
    const ageCount: Record<string, number> = {};
    volunteers.forEach((v: VolunteerStats) => {
      ageCount[v.ageRange] = (ageCount[v.ageRange] || 0) + 1;
    });
    const ageStats = Object.entries(ageCount).map(([range, count]) => ({
      range,
      count,
    }));

    // 4. Gender Distribution
    const sexCount: Record<string, number> = {};
    volunteers.forEach((v: VolunteerStats) => {
      sexCount[v.sex] = (sexCount[v.sex] || 0) + 1;
    });
    const sexStats = Object.entries(sexCount).map(([sex, count]) => ({
      sex: sex.charAt(0).toUpperCase() + sex.slice(1),
      count,
    }));

    // 5. Duration Preference
    const durationCount: Record<string, number> = {};
    volunteers.forEach((v: VolunteerStats) => {
      const key =
        v.duration === 'full'
          ? 'Full session (5 days)'
          : `${v.duration} day${v.duration === '1' ? '' : 's'}`;
      durationCount[key] = (durationCount[key] || 0) + 1;
    });
    const durationStats = Object.entries(durationCount).map(
      ([duration, count]) => ({ duration, count })
    );

    // 6. Monthly Trend (last 3 months)
    const now = new Date();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthlyStats: { month: string; count: number }[] = [];
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = volunteers.filter(
        (v: VolunteerStats) => v.createdAt >= monthStart && v.createdAt <= monthEnd
      ).length;

      monthlyStats.push({
        month: monthNames[date.getMonth()],
        count,
      });
    }

    // 7. Status Distribution
    const statusCount: Record<string, number> = {};
    volunteers.forEach((v: VolunteerStats) => {
      statusCount[v.status] = (statusCount[v.status] || 0) + 1;
    });
    const statusStats = Object.entries(statusCount).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));

    // 8. Growth Rate (comparing last month to previous month)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0);

    const lastMonthCount = volunteers.filter(
      (v: VolunteerStats) => v.createdAt >= lastMonthStart && v.createdAt <= lastMonthEnd
    ).length;

    const prevMonthCount = volunteers.filter(
      (v: VolunteerStats) => v.createdAt >= prevMonthStart && v.createdAt <= prevMonthEnd
    ).length;

    const growthRate =
      prevMonthCount > 0
        ? Math.round(((lastMonthCount - prevMonthCount) / prevMonthCount) * 100)
        : 0;

    const response = {
      success: true,
      data: {
        overview: {
          totalVolunteers,
          activeDistricts: Object.keys(districtCount).length,
          serviceTypes: Object.keys(volunteerTypeCount).length,
          growthRate,
        },
        volunteerTypeStats,
        districtStats,
        ageStats,
        sexStats,
        durationStats,
        monthlyStats,
        statusStats,
      },
    };

    // Cache for 5 minutes
    await cache.set('volunteer_stats', response, 300);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch statistics',
      },
      { status: 500 }
    );
  }
}
