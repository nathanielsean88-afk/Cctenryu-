import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getApplications, saveApplication, getMemberByClerkId } from '@/lib/storage'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama, ccSebelumnya, alasanKeluar, alasanMasuk, tiktok, discord, whatsapp, umur, asalKota } = body

    if (!nama || !whatsapp || !discord || !alasanMasuk) {
      return NextResponse.json({ error: 'Nama, WhatsApp, Discord, dan Alasan Masuk wajib diisi' }, { status: 400 })
    }

    // Cek duplikat via WhatsApp atau Discord
    const existing = getApplications().find(a =>
      (a as any).whatsapp === whatsapp || (a as any).discord === discord
    )
    if (existing) return NextResponse.json({ error: 'Kamu sudah pernah mendaftar!' }, { status: 409 })

    const { userId } = await auth().catch(() => ({ userId: null }))

    const app = {
      id: randomUUID(),
      nama: nama ?? '',
      ccSebelumnya: ccSebelumnya || '-',
      alasanKeluar: alasanKeluar || '-',
      alasanMasuk,
      tiktok: tiktok || '',
      discord,
      whatsapp,
      umur: umur || '',
      asalKota: asalKota || '',
      status: 'PENDING' as const,
      adminNote: '',
      reviewedBy: '',
      reviewedAt: '',
      createdAt: new Date().toISOString(),
      userId: userId ?? '',
      // legacy
      firstName: nama?.split(' ')[0] ?? '',
      lastName: nama?.split(' ').slice(1).join(' ') ?? '',
      email: '', phone: whatsapp, birthDate: '',
      city: asalKota || '', profession: '', institution: '',
      division: 'GENERAL', motivation: alasanMasuk,
      contribution: '', referral: '', portfolio: '',
    }

    saveApplication(app as any)
    return NextResponse.json({ success: true, id: app.id }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const member = getMemberByClerkId(userId)
    if (!member || member.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json(getApplications())
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
