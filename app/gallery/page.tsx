// app/gallery/page.tsx
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import GalleryClient from './GalleryClient'

export const revalidate = 60 // revalidate every minute

export default async function GalleryPage() {
  const members = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    orderBy: { joinedAt: 'desc' },
    select: {
      id: true, name: true, imageUrl: true,
      division: true, bio: true, joinedAt: true,
      application: { select: { profession: true, institution: true, portfolio: true } },
    },
  })

  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <GalleryClient members={members} />
    </>
  )
}
