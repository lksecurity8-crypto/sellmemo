import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/admin/payment-methods/[id]
 * Récupère une méthode de paiement spécifique
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: params.id },
    })

    if (!paymentMethod) {
      return NextResponse.json(
        { message: 'Méthode de paiement non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(paymentMethod)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/payment-methods/[id]
 * Met à jour une méthode de paiement
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { type, name, accountHolder, accountNumber, isActive } = await req.json()

    // Vérifier si la méthode existe
    const existing = await prisma.paymentMethod.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { message: 'Méthode de paiement non trouvée' },
        { status: 404 }
      )
    }

    // Si le type change, vérifier qu'il n'existe pas déjà
    if (type && type !== existing.type) {
      const duplicate = await prisma.paymentMethod.findUnique({
        where: { type },
      })
      if (duplicate) {
        return NextResponse.json(
          { message: 'Cette méthode de paiement existe déjà' },
          { status: 409 }
        )
      }
    }

    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: { id: params.id },
      data: {
        type: type || existing.type,
        name: name || existing.name,
        accountHolder: accountHolder || existing.accountHolder,
        accountNumber: accountNumber || existing.accountNumber,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
    })

    return NextResponse.json(updatedPaymentMethod)
  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/payment-methods/[id]
 * Supprime une méthode de paiement
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.paymentMethod.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Méthode de paiement supprimée' })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
