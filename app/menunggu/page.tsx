// app/menunggu/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getApplications } from '@/lib/storage'
import MenungguClient from './MenungguClient'

export const dynamic = 'force-dynamic'

export default async function MenungguPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  // Cek apakah sudah isi form pendaftaran
  const application = getApplications().find(a => (a as any).userId === userId) ?? null
  const status = application?.status ?? null

  return <MenungguClient status={status} hasApplied={!!application} />
}
