import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/payment-methods
 * Récupère toutes les méthodes de paiement actives (publique)
 */
export async function GET(req: NextRequest) {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { isActive: true },
      select: {
        id: true,
        type: true,
        name: true,
        accountHolder: true,
        accountNumber: true,
      },
    })

    return NextResponse.json(paymentMethods)
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des méthodes de paiement' },
      { status: 500 }
    )
  }
}
