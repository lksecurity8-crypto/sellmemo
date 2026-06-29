import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, paymentMethod, transactionId, plan } = await req.json()

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        paymentMethod,
        transactionId,
        status: 'pending',
        plan,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la création du paiement' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    const payments = await prisma.payment.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des paiements' },
      { status: 500 }
    )
  }
}
