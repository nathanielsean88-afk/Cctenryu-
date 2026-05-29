import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/lib/auth'
import { getApplications } from '@/lib/storage'
import ProfileClient from './ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await getOrCreateUser()
  if (!user) redirect('/login')

  const rawApp = getApplications().find(a => (a as any).userId === userId) ?? null
  const application = rawApp ? {
    profession: rawApp.profession,
    institution: rawApp.institution,
    city: rawApp.city,
    phone: rawApp.phone,
  } : null

  const userWithDate = {
    ...user,
    joinedAt: new Date(user.joinedAt),
  }

  return <ProfileClient user={userWithDate} application={application} />
}
