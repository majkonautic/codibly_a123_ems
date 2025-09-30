import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        performances: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        },
        alerts: {
          where: { isRead: false },
          take: 3
        }
      }
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const asset = await prisma.asset.create({
      data: body
    });
    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}