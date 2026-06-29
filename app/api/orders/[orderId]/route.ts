import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    })

    if (!order) {
      return NextResponse.json({ message: 'Commande non trouvée' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const data = await req.json()

    const order = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        product: data.product,
        quantity: data.quantity,
        price: data.price,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
        deliveryTime: data.deliveryTime,
        status: data.status,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await prisma.order.delete({
      where: { id: params.orderId },
    })

    return NextResponse.json({ message: 'Commande supprimée' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
