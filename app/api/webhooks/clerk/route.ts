import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { saveMember, getMemberByClerkId, updateMember } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')
  if (!svix_id || !svix_timestamp || !svix_signature) return NextResponse.json({ error: 'Missing headers' }, { status: 400 })

  const payload = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let event: any
  try {
    event = wh.verify(payload, { 'svix-id': svix_id, 'svix-timestamp': svix_timestamp, 'svix-signature': svix_signature })
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = event
  const email = data.email_addresses?.[0]?.email_address ?? ''
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User'
  const role = data.public_metadata?.role ?? 'MEMBER'

  if (type === 'user.created') {
    saveMember({ id: data.id, clerkId: data.id, email, name, imageUrl: data.image_url ?? '', role, division: '', bio: '', portfolio: '', joinedAt: new Date().toISOString() })
  }
  if (type === 'user.updated') {
    const existing = getMemberByClerkId(data.id)
    if (existing) updateMember(data.id, { email, name, imageUrl: data.image_url ?? '', role })
    else saveMember({ id: data.id, clerkId: data.id, email, name, imageUrl: data.image_url ?? '', role, division: '', bio: '', portfolio: '', joinedAt: new Date().toISOString() })
  }

  return NextResponse.json({ received: true })
}
