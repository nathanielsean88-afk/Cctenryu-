// app/api/applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      firstName, lastName, email, phone, birthDate, city,
      profession, institution, division,
      motivation, contribution, referral, portfolio,
    } = body

    if (!firstName || !lastName || !email || !division || !motivation) {
      return NextResponse.json({ error: 'Field wajib belum lengkap' }, { status: 400 })
    }

    // Cek apakah email sudah pernah daftar
    const existing = await prisma.application.findFirst({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email sudah pernah mendaftar' }, { status: 409 })
    }

    const { userId } = await auth()

    const application = await prisma.application.create({
      data: {
        firstName, lastName, email, phone, birthDate, city,
        profession, institution,
        division: division as any,
        motivation, contribution, referral,
        portfolio: portfolio || null,
        userId: userId ? (await prisma.user.findUnique({ where: { clerkId: userId } }))?.id : undefined,
      },
    })

    return NextResponse.json({ success: true, id: application.id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/applications]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const applications = await prisma.application.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(applications)
  } catch (err) {
    console.error('[GET /api/applications]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
