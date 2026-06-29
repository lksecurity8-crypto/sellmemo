import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/admin/payment-methods
 * Récupère toutes les méthodes de paiement
 */
export async function GET(req: NextRequest) {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: { createdAt: 'desc' },
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

/**
 * POST /api/admin/payment-methods
 * Crée une nouvelle méthode de paiement
 */
export async function POST(req: NextRequest) {
  try {
    const { type, name, accountHolder, accountNumber, isActive } = await req.json()

    if (!type || !name || !accountHolder || !accountNumber) {
      return NextResponse.json(
        { message: 'Tous les champs sont obligatoires' },
        { status: 400 }
      )
    }

    // Vérifier si la méthode existe déjà
    const existing = await prisma.paymentMethod.findUnique({
      where: { type },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Cette méthode de paiement existe déjà' },
        { status: 409 }
      )
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        type,
        name,
        accountHolder,
        accountNumber,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(paymentMethod, { status: 201 })
  } catch (error) {
    console.error('Error creating payment method:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création de la méthode de paiement' },
      { status: 500 }
    )
  }
}
