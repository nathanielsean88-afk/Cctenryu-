// app/member/profile/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await getOrCreateUser()
  if (!user) redirect('/login')

  const application = await prisma.application.findFirst({
    where: { userId: user.id },
  })

  return <ProfileClient user={user} application={application} />
}
