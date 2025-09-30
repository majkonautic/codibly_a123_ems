import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { name: 'Main Portfolio' }
    });

    // Get current metrics from assets
    const assets = await prisma.asset.findMany({
      include: {
        performances: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    const totalCapacity = assets.reduce((sum: number, asset: any) => sum + asset.capacity, 0);
    const currentGeneration = assets.reduce((sum: number, asset: any) => {
      const latestPerformance = asset.performances[0];
      return sum + (latestPerformance?.generation || 0);
    }, 0);

    const statusCounts = assets.reduce((counts: Record<string, number>, asset: any) => {
      counts[asset.status] = (counts[asset.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const efficiency = currentGeneration / totalCapacity * 100;

    return NextResponse.json({
      portfolio: portfolio || {
        name: 'Main Portfolio',
        totalCapacity,
        currentGeneration
      },
      totalCapacity,
      currentGeneration,
      efficiency: isNaN(efficiency) ? 0 : efficiency,
      assetCount: assets.length,
      statusCounts,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}