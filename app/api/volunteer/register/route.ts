import { NextRequest, NextResponse } from 'next/server';
import { volunteerFormSchema } from '@/lib/validations/volunteer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = volunteerFormSchema.parse(body);

    // TODO: Save to database
    // Example:
    // const volunteer = await db.volunteer.create({
    //   data: validatedData,
    // });

    console.log('Volunteer registration:', validatedData);

    // TODO: Send confirmation email/WhatsApp
    // Example:
    // await sendWhatsAppNotification(validatedData.whatsapp);
    // await sendEmailConfirmation(validatedData.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: {
          name: validatedData.name,
          whatsapp: validatedData.whatsapp,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
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
