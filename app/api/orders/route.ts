import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const orderCount = await prisma.order.count({
      where: { userId },
    })

    if (user.plan === 'free' && orderCount >= 5) {
      return NextResponse.json(
        { message: 'Limite de 5 commandes atteinte. Veuillez vous abonner.' },
        { status: 403 }
      )
    }

    const { clientName, clientPhone, product, quantity, price, deliveryDate, deliveryTime } = await req.json()

    const order = await prisma.order.create({
      data: {
        userId,
        clientName,
        clientPhone,
        product,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        status: 'pending',
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    const status = req.nextUrl.searchParams.get('status')

    const where: any = { userId }
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      orderBy: { deliveryDate: 'asc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}
