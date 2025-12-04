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
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const district = searchParams.get('district') || '';
    const volunteerType = searchParams.get('volunteerType') || '';
    const status = searchParams.get('status') || '';

    // Build where clause for filtering
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { whatsapp: { contains: search } },
      ];
    }

    // District filter
    if (district && district !== 'all') {
      where.district = district;
    }

    // Volunteer type filter
    if (volunteerType && volunteerType !== 'all') {
      where.volunteerType = volunteerType;
    }

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Try to get from cache first (only for non-filtered requests)
    const isFiltered = search || (district && district !== 'all') ||
                      (volunteerType && volunteerType !== 'all') ||
                      (status && status !== 'all');

    const cacheKey = !isFiltered ? `volunteers:page:${page}:limit:${limit}` : null;

    if (cacheKey) {
      const cached = await cache.get(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    // Fetch volunteers with pagination
    const [volunteers, total] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.volunteer.count({ where }),
    ]);

    const response = {
      success: true,
      data: volunteers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache for 1 minute if not filtered
    if (cacheKey) {
      await cache.set(cacheKey, response, 60);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch volunteers',
      },
      { status: 500 }
    );
  }
}
