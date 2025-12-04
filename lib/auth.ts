import { NextRequest } from 'next/server';
import { prisma } from './prisma';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Verify admin session from request cookies
 * Returns admin data if authenticated, null otherwise
 */
export async function verifyAdminSession(
  request: NextRequest
): Promise<AuthenticatedAdmin | null> {
  try {
    const token = request.cookies.get('session')?.value;

    if (!token) {
      return null;
    }

    // Find session
    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({
        where: { id: session.id },
      });
      return null;
    }

    // Get admin details
    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return admin;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

/**
 * Require authentication middleware
 * Returns error response if not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const admin = await verifyAdminSession(request);

  if (!admin) {
    return {
      error: true,
      response: Response.json(
        {
          success: false,
          message: 'Unauthorized. Please login.',
        },
        { status: 401 }
      ),
    };
  }

  return { error: false, admin };
}
