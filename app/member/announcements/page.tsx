import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/lib/auth'
import { getAnnouncements, getMembers } from '@/lib/storage'
import AnnouncementsClient from './AnnouncementsClient'

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await getOrCreateUser()
  if (!user) redirect('/login')

  const announcements = getAnnouncements().map(a => ({
    ...a,
    createdAt: new Date(a.createdAt),
  }))

  // Ambil nama author untuk tiap announcement
  const members = getMembers()
  const announcementsWithAuthor = announcements.map(a => {
    const author = members.find(m => m.clerkId === a.authorId)
    return { ...a, authorName: author?.name ?? 'Admin' }
  })

  const isAdmin = user.role === 'ADMIN'

  return <AnnouncementsClient
    announcements={announcementsWithAuthor}
    isAdmin={isAdmin}
    user={{ name: user.name, division: user.division || null }}
  />
}
