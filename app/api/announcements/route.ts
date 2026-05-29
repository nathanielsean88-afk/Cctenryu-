import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAnnouncements, saveAnnouncement, deleteAnnouncement, getMemberByClerkId } from '@/lib/storage'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const admin = getMemberByClerkId(userId)
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { title, content, pinned } = await req.json()
    if (!title || !content) return NextResponse.json({ error: 'Judul dan isi wajib diisi' }, { status: 400 })

    const ann = saveAnnouncement({ id: randomUUID(), title, content, pinned: pinned ?? false, authorId: userId, createdAt: new Date().toISOString() })
    return NextResponse.json({ success: true, announcement: ann }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(getAnnouncements())
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const admin = getMemberByClerkId(userId)
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await req.json()
    deleteAnnouncement(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
