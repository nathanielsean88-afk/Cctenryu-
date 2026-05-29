// lib/auth.ts — tanpa database, pakai JSON storage
import { auth, currentUser } from '@clerk/nextjs/server'
import { getMemberByClerkId, saveMember } from './storage'

export type UserRole = 'ADMIN' | 'MEMBER'

export async function getCurrentRole(): Promise<UserRole | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const role = user?.publicMetadata?.role as UserRole | undefined
  return role ?? 'MEMBER'
}

export async function isAdmin(): Promise<boolean> {
  const role = await getCurrentRole()
  return role === 'ADMIN'
}

export async function getOrCreateUser() {
  const { userId } = await auth()
  if (!userId) return null
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const existing = getMemberByClerkId(userId)
  if (existing) return existing

  const member = saveMember({
    id: userId,
    clerkId: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
    imageUrl: clerkUser.imageUrl ?? '',
    role: (clerkUser.publicMetadata?.role as UserRole) ?? 'MEMBER',
    division: '',
    bio: '',
    portfolio: '',
    joinedAt: new Date().toISOString(),
  })
  return member
}

export async function setUserRole(clerkUserId: string, role: UserRole) {
  const response = await fetch(
    `https://api.clerk.com/v1/users/${clerkUserId}/metadata`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_metadata: { role } }),
    }
  )
  if (!response.ok) throw new Error('Failed to update Clerk role')
  return response.json()
}
