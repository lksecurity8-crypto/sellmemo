import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const stats = {
      totalUsers: await prisma.user.count(),
      totalOrders: await prisma.order.count(),
      totalRevenue: await prisma.payment.aggregate({
        where: { status: 'approved' },
        _sum: { amount: true },
      }),
      pendingPayments: await prisma.payment.count({ where: { status: 'pending' } }),
      activeSubscriptions: await prisma.user.count({
        where: {
          AND: [
            { plan: { not: 'free' } },
            { subscriptionExpiresAt: { gt: new Date() } },
          ],
        },
      }),
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
