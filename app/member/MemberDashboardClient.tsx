'use client'
// app/member/MemberDashboardClient.tsx
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

type Props = {
  user: { name: string; email: string; division: string | null; joinedAt: Date }
  announcements: { id: string; title: string; content: string; createdAt: Date }[]
  members: { id: string; name: string; imageUrl: string | null; division: string | null }[]
  totalMembers: number
}

const DIVISION_LABELS: Record<string, string> = {
  CREATIVE: 'Creative', TECHNOLOGY: 'Technology', BUSINESS: 'Business',
  OPERATIONS: 'Operations', CONTENT: 'Content', FINANCE: 'Finance',
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/member' },
  { id: 'profile', label: 'Edit Profil', href: '/member/profile' },
  { id: 'gallery', label: 'Galeri Anggota', href: '/gallery' },
  { id: 'pendaftaran', label: 'Form Pendaftaran', href: '/pendaftaran' },
]

export default function MemberDashboardClient({ user, announcements, members, totalMembers }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '260px 1fr', background: 'var(--obsidian)' }}>

      {/* Sidebar */}
      <aside style={{ background: 'var(--dark-2)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '40px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 28px 28px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)' }}>
            <Image src="/logo.png" alt="Tenryu" width={30} height={30} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--snow)' }}>TENRYU</div>
        </Link>

        {/* Profile */}
        <div style={{ padding: '0 28px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserButton appearance={{ elements: { avatarBox: { width: 44, height: 44, border: '1.5px solid var(--crimson)' } } }} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--snow)' }}>{user.name}</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: 2 }}>
              {user.division ? DIVISION_LABELS[user.division] : 'Member'}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 16px' }}>
          {navItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 2,
                textDecoration: 'none', marginBottom: 2,
                color: 'var(--mist)',
                fontFamily: "'Cinzel', serif", fontSize: 10,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--snow)'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(139,26,26,0.15)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--mist)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ padding: '48px 56px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 40, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Selamat Datang Kembali</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: 'var(--snow)' }}>{user.name}</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          {[
            { label: 'Status Keanggotaan', value: 'Aktif', sub: `Sejak ${new Date(user.joinedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}` },
            { label: 'Total Anggota', value: totalMembers, sub: 'Anggota aktif circle' },
            { label: 'Divisi', value: user.division ? DIVISION_LABELS[user.division] : '—', sub: 'Divisi kamu' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: 28, position: 'relative', borderRadius: 3 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: 'var(--crimson)' }} />
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: 12 }}>{s.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: 'var(--snow)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--smoke)', marginTop: 8, fontStyle: 'italic' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Announcements */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'var(--snow)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          Pengumuman Terbaru
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
          {announcements.length === 0 && (
            <p style={{ color: 'var(--mist)', fontStyle: 'italic' }}>Belum ada pengumuman.</p>
          )}
          {announcements.map(a => (
            <div key={a.id} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', borderRadius: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--crimson)', marginTop: 7, flexShrink: 0, boxShadow: '0 0 8px var(--crimson-glow)' }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--snow)', marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>
                  {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontSize: 14, color: 'var(--mist)', fontStyle: 'italic' }}>{a.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Members */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'var(--snow)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          Anggota Terbaru
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {members.map(m => (
            <div key={m.id} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: 20, display: 'flex', gap: 14, alignItems: 'center', borderRadius: 3 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--crimson-light)', background: 'var(--dark-3)', flexShrink: 0 }}>
                {getInitials(m.name)}
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: 'var(--snow)' }}>{m.name}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                  {m.division ? DIVISION_LABELS[m.division] : 'Member'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
