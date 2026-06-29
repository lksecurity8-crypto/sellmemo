import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, name: true, email: true, phone: true, plan: true, subscriptionExpiresAt: true },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const data = await req.json()

    const user = await prisma.user.update({
      where: { id: params.userId },
      data: {
        name: data.name,
        phone: data.phone,
      },
      select: { id: true, name: true, email: true, phone: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
