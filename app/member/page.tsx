import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/lib/auth'
import { getAnnouncements, getMembers } from '@/lib/storage'
import MemberDashboardClient from './MemberDashboardClient'

export const dynamic = 'force-dynamic'

export default async function MemberPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await getOrCreateUser()
  if (!user) redirect('/login')
  if (user.role === 'ADMIN') redirect('/admin')

  const announcements = getAnnouncements().slice(0, 5).map(a => ({
    ...a,
    createdAt: new Date(a.createdAt),
  }))

  const members = getMembers().filter(m => m.role === 'MEMBER').slice(0, 6).map(m => ({
    ...m,
    joinedAt: new Date(m.joinedAt),
  }))

  const totalMembers = getMembers().filter(m => m.role === 'MEMBER').length

  const userWithDate = {
    ...user,
    joinedAt: new Date(user.joinedAt),
  }

  return <MemberDashboardClient user={userWithDate} announcements={announcements} members={members} totalMembers={totalMembers} />
}
