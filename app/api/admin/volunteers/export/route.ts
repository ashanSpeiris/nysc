import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Check authentication
  const auth = await requireAuth(request);
  if (auth.error) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);

    // Parse filters (same as list API)
    const search = searchParams.get('search') || '';
    const district = searchParams.get('district') || '';
    const volunteerType = searchParams.get('volunteerType') || '';
    const status = searchParams.get('status') || '';

    // Build where clause for filtering
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { whatsapp: { contains: search } },
      ];
    }

    if (district && district !== 'all') {
      where.district = district;
    }

    if (volunteerType && volunteerType !== 'all') {
      where.volunteerType = volunteerType;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Fetch all matching volunteers
    const volunteers = await prisma.volunteer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    type VolunteerExport = {
      id: string;
      name: string;
      email: string;
      whatsapp: string;
      ageRange: string;
      sex: string;
      district: string;
      volunteerType: string;
      startDate: Date;
      duration: string;
      availableDistricts: string[];
      status: string;
      createdAt: Date;
    };

    // Generate CSV
    const headers = [
      'ID',
      'Name',
      'Email',
      'WhatsApp',
      'Age Range',
      'Sex',
      'District',
      'Volunteer Type',
      'Start Date',
      'Duration',
      'Available Districts',
      'Status',
      'Registered On',
    ];

    const rows = volunteers.map((v: VolunteerExport) => [
      v.id,
      v.name,
      v.email || 'N/A',
      v.whatsapp,
      v.ageRange,
      v.sex,
      v.district.replace('_', ' '),
      v.volunteerType.replace(/([A-Z])/g, ' $1').trim(),
      v.startDate.toISOString().split('T')[0],
      v.duration === 'full'
        ? 'Full session (5 days)'
        : `${v.duration} day${v.duration === '1' ? '' : 's'}`,
      v.availableDistricts.map((d) => d.replace('_', ' ')).join('; '),
      v.status,
      v.createdAt.toISOString().split('T')[0],
    ]);

    // Escape CSV values
    const escapeCsvValue = (value: any): string => {
      const str = String(value).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str}"`
        : str;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map(escapeCsvValue).join(',')),
    ].join('\r\n');

    // Add UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const csvWithBom = BOM + csvContent;

    // Return as downloadable file
    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': `attachment; filename="NYSC-Volunteers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting volunteers:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to export volunteers',
      },
      { status: 500 }
    );
  }
}
