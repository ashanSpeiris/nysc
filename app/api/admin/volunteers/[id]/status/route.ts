import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { cache } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const auth = await requireAuth(request);
  if (auth.error) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status. Must be one of: pending, approved, rejected',
        },
        { status: 400 }
      );
    }

    // Check if volunteer exists
    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
    });

    if (!volunteer) {
      return NextResponse.json(
        {
          success: false,
          message: 'Volunteer not found',
        },
        { status: 404 }
      );
    }

    // Update volunteer status
    const updated = await prisma.volunteer.update({
      where: { id },
      data: { status },
    });

    // Invalidate cache
    await cache.clearPattern('volunteers:*');
    await cache.del('volunteer_stats');

    return NextResponse.json({
      success: true,
      message: 'Volunteer status updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update volunteer status',
      },
      { status: 500 }
    );
  }
}
