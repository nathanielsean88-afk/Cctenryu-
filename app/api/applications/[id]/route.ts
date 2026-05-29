import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getApplications, updateApplicationStatus, getMemberByClerkId, updateMember } from '@/lib/storage'
import { setUserRole } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getMemberByClerkId(userId)
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { status, adminNote } = await req.json()
    if (!['APPROVED', 'REJECTED'].includes(status)) return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })

    const application = getApplications().find(a => a.id === params.id)
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = updateApplicationStatus(params.id, status, adminNote ?? '', userId)

    if (status === 'APPROVED') {
      const appUserId = (application as any).userId
      if (appUserId) {
        // Update di JSON storage
        updateMember(appUserId, { role: 'MEMBER' })
        // Update di Clerk supaya sessionClaims ikut update
        try {
          await setUserRole(appUserId, 'MEMBER')
        } catch (e) {
          console.error('Failed to update Clerk role:', e)
        }
      }
    }

    return NextResponse.json({ success: true, application: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const admin = getMemberByClerkId(userId)
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const app = getApplications().find(a => a.id === params.id)
    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(app)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
