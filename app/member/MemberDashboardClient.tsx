'use client'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

type Props = {
  user: { name: string; email: string; division: string | null; joinedAt: Date; role: string }
  announcements: { id: string; title: string; content: string; createdAt: Date }[]
  members: { id: string; name: string; imageUrl: string | null; division: string | null }[]
  totalMembers: number
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/member' },
  { id: 'profile', label: 'Edit Profil', href: '/member/profile' },
  { id: 'gallery', label: 'Galeri Anggota', href: '/gallery' },
]

export default function MemberDashboardClient({ user, announcements, members, totalMembers }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--obsidian)' }}>
      <style>{`
        .dash-layout { display: grid; grid-template-columns: 1fr; }
        .dash-sidebar { display: none; }
        .dash-topbar { display: flex; }
        @media(min-width: 768px) {
          .dash-layout { grid-template-columns: 240px 1fr; }
          .dash-sidebar { display: block !important; }
          .dash-topbar { display: none !important; }
        }
        .dash-cards { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media(min-width: 640px) { .dash-cards { grid-template-columns: repeat(3, 1fr); } }
        .member-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media(min-width: 640px) { .member-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width: 1024px) { .member-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <div className="dash-layout">
        {/* Sidebar desktop */}
        <aside className="dash-sidebar" style={{ background: 'var(--dark-2)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '32px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px 24px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Image src="/logo.png" alt="Tenryu" width={26} height={26} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: 'var(--snow)' }}>TENRYU</div>
          </Link>
          <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <UserButton appearance={{ elements: { avatarBox: { width: 40, height: 40, border: '1.5px solid var(--crimson)' } } }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: 'var(--snow)' }}>{user.name}</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Member</div>
            </div>
          </div>
          <nav style={{ padding: '0 12px' }}>
            {navItems.map(item => (
              <Link key={item.id} href={item.href} style={{ display: 'block', padding: '11px 12px', borderRadius: 2, textDecoration: 'none', marginBottom: 2, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--mist)', textTransform: 'uppercase', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--snow)'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(139,26,26,0.15)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--mist)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile topbar */}
        <div className="dash-topbar" style={{ background: 'var(--dark-2)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Image src="/logo.png" alt="Tenryu" width={28} height={28} style={{ objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: 'var(--snow)' }}>TENRYU</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/member/profile" style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.15em', color: 'var(--mist)', textDecoration: 'none', textTransform: 'uppercase' }}>Profil</Link>
            <UserButton appearance={{ elements: { avatarBox: { width: 32, height: 32, border: '1.5px solid var(--crimson)' } } }} />
          </div>
        </div>

        {/* Main */}
        <main style={{ padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 48px)', overflowY: 'auto' }}>
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>Selamat Datang</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 300, color: 'var(--snow)' }}>{user.name}</div>
          </div>

          <div className="dash-cards" style={{ marginBottom: 40 }}>
            {[
              { label: 'Status', value: 'Aktif', sub: `Sejak ${new Date(user.joinedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}` },
              { label: 'Total Anggota', value: totalMembers, sub: 'Anggota aktif' },
              { label: 'Role', value: user.role === 'ADMIN' ? 'Admin' : 'Member', sub: 'Role kamu' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: 24, position: 'relative', borderRadius: 3 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: 'var(--crimson)' }} />
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: 10 }}>{s.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: 'var(--snow)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--smoke)', marginTop: 6, fontStyle: 'italic' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: 'var(--snow)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            Announcement <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            {announcements.length === 0 && <p style={{ color: 'var(--mist)', fontStyle: 'italic' }}>Belum ada pengumuman.</p>}
            {announcements.map(a => (
              <div key={a.id} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', borderRadius: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--crimson)', marginTop: 8, flexShrink: 0, boxShadow: '0 0 8px var(--crimson-glow)' }} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: 'var(--snow)', marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 6 }}>
                    {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--mist)', fontStyle: 'italic' }}>{a.content}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: 'var(--snow)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            Anggota <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div className="member-grid">
            {members.map(m => (
              <div key={m.id} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: 16, display: 'flex', gap: 12, alignItems: 'center', borderRadius: 3 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: 'var(--crimson-light)', background: 'var(--dark-3)', flexShrink: 0 }}>
                  {getInitials(m.name)}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: 'var(--snow)' }}>{m.name}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
