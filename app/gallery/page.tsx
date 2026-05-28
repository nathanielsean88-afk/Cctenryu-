import { getMembers } from '@/lib/storage'
import Navbar from '@/components/layout/Navbar'
import GalleryClient from './GalleryClient'

export const dynamic = 'force-dynamic'

export default function GalleryPage() {
  const members = getMembers()
    .filter(m => m.role === 'MEMBER')
    .map(m => ({
      id: m.id,
      name: m.name,
      imageUrl: m.imageUrl || null,
      division: m.division || null,
      bio: m.bio || null,
      joinedAt: new Date(m.joinedAt),
      application: null,
    }))

  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <GalleryClient members={members} />
    </>
  )
}
