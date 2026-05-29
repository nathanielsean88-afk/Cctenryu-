import { NextRequest, NextResponse } from 'next/server'
import { getMemberByClerkId, saveMember } from '@/lib/storage'

// Cara set admin pertama kali:
// POST ke /api/admin/setrole dengan body { secret: "ADMIN_SECRET_kamu", clerkId: "user_xxx" }
export async function PUT(req: NextRequest) {
  try {
    const { secret, clerkId } = await req.json()
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
    }
    const member = getMemberByClerkId(clerkId)
    if (!member) return NextResponse.json({ error: 'User tidak ditemukan. Login dulu!' }, { status: 404 })
    saveMember({ ...member, role: 'ADMIN' })
    return NextResponse.json({ success: true, message: `${member.name} sekarang ADMIN!` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
