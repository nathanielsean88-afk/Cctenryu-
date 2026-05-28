// app/member/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import MemberDashboardClient from './MemberDashboardClient'

export default async function MemberPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await getOrCreateUser()
  if (!user) redirect('/login')

  // If admin, redirect to admin panel
  if (user.role === 'ADMIN') redirect('/admin')

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const members = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    orderBy: { joinedAt: 'desc' },
    take: 6,
    select: { id: true, name: true, imageUrl: true, division: true },
  })

  const totalMembers = await prisma.user.count({ where: { role: 'MEMBER' } })

  return (
    <MemberDashboardClient
      user={user}
      announcements={announcements}
      members={members}
      totalMembers={totalMembers}
    />
  )
}
