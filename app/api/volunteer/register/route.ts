import { NextRequest, NextResponse } from 'next/server';
import { volunteerFormSchema } from '@/lib/validations/volunteer';
import { prisma } from '@/lib/prisma';
import { rateLimit, statsCache } from '@/lib/redis';

// Get client IP address
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 10 requests per minute per IP
    const clientIp = getClientIp(request);
    const isLimited = await rateLimit.isRateLimited(clientIp, 10, 60);

    if (isLimited) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again in a minute.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { recaptchaToken, ...formData } = body;

    // Verify reCAPTCHA token only if provided (optional for now)
    if (recaptchaToken) {
      const recaptchaResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        }
      );

      const recaptchaResult = await recaptchaResponse.json();

      if (!recaptchaResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'reCAPTCHA verification failed. Please try again.',
          },
          { status: 400 }
        );
      }
    }

    // Validate the request body
    const validatedData = volunteerFormSchema.parse(formData);

    // Save to database
    const volunteer = await prisma.volunteer.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        whatsapp: validatedData.whatsapp,
        ageRange: validatedData.ageRange,
        sex: validatedData.sex,
        district: validatedData.district,
        volunteerType: validatedData.volunteerType,
        startDate: new Date(validatedData.startDate),
        duration: validatedData.duration,
        availableDistricts: validatedData.availableDistricts,
        status: 'pending',
      },
    });

    // Invalidate statistics cache since we added a new volunteer
    await statsCache.invalidateStats();

    console.log('✅ Volunteer registered:', volunteer.id);

    // TODO: Send confirmation WhatsApp/Email
    // await sendWhatsAppNotification(validatedData.whatsapp);
    // await sendEmailConfirmation(validatedData.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! We will contact you via WhatsApp soon.',
        data: {
          id: volunteer.id,
          name: volunteer.name,
          whatsapp: volunteer.whatsapp,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Registration error:', error);

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error. Please check your input.',
          errors: error,
        },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          message: 'This email or WhatsApp number is already registered.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Volunteer registration API is running',
  });
}
