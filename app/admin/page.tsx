import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getApplications, getMembers, getAnnouncements } from '@/lib/storage'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')
  if (!(await isAdmin())) redirect('/member')

  const rawApplications = getApplications()
  const rawMembers = getMembers().filter(m => m.role === 'MEMBER')
  const rawAnnouncements = getAnnouncements()

  // Convert string dates to Date objects for AdminClient
  const applications = rawApplications.map(a => ({
    ...a,
    createdAt: new Date(a.createdAt),
    reviewedAt: a.reviewedAt ? new Date(a.reviewedAt) : null,
  }))

  const members = rawMembers.map(m => ({
    ...m,
    joinedAt: new Date(m.joinedAt),
  }))

  const announcements = rawAnnouncements.map(a => ({
    ...a,
    createdAt: new Date(a.createdAt),
  }))

  const stats = {
    total: members.length,
    pending: rawApplications.filter(a => a.status === 'PENDING').length,
    approved: rawApplications.filter(a => a.status === 'APPROVED').length,
    rejected: rawApplications.filter(a => a.status === 'REJECTED').length,
  }

  return <AdminClient applications={applications} members={members} announcements={announcements} stats={stats} />
}
