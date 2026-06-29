import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    const { status } = await req.json()

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { message: 'Statut invalide' },
        { status: 400 }
      )
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.paymentId },
    })

    if (!payment) {
      return NextResponse.json(
        { message: 'Paiement non trouvé' },
        { status: 404 }
      )
    }

    // Si le paiement est approuvé, mettre à jour l'abonnement
    if (status === 'approved') {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          plan: payment.plan,
          subscriptionExpiresAt: expiresAt,
        },
      })
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: params.paymentId },
      data: { status },
    })

    return NextResponse.json(updatedPayment)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du paiement' },
      { status: 500 }
    )
  }
}
