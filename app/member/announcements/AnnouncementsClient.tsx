'use client'
import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { useState } from 'react'

type Announcement = {
  id: string
  title: string
  content: string
  pinned: boolean
  authorName: string
  createdAt: Date
}

type Props = {
  announcements: Announcement[]
  isAdmin: boolean
  user: { name: string; division: string | null }
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/member' },
  { id: 'announcements', label: 'Announcement', href: '/member/announcements' },
  { id: 'profile', label: 'Edit Profil', href: '/member/profile' },
  { id: 'gallery', label: 'Galeri Anggota', href: '/gallery' },
]

function formatDate(d: Date) {
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTime(d: Date) {
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function AnnouncementsClient({ announcements, isAdmin, user }: Props) {
  const [selected, setSelected] = useState<Announcement | null>(announcements[0] ?? null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', pinned: false })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [list, setList] = useState(announcements)

  const pinned = list.filter(a => a.pinned)
  const regular = list.filter(a => !a.pinned)
  const sorted = [...pinned, ...regular]

  const handlePost = async () => {
    if (!form.title.trim() || !form.content.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        const newAnn = { ...data.announcement, createdAt: new Date(data.announcement.createdAt), authorName: user.name }
        setList(prev => [newAnn, ...prev])
        setSelected(newAnn)
        setForm({ title: '', content: '', pinned: false })
        setShowForm(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus announcement ini?')) return
    setDeleting(id)
    try {
      await fetch('/api/announcements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setList(prev => prev.filter(a => a.id !== id))
      if (selected?.id === id) setSelected(sorted.find(a => a.id !== id) ?? null)
    } finally {
      setDeleting(null)
    }
  }

  const sidebarStyle: React.CSSProperties = {
    background: 'var(--dark-2)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    padding: '40px 0',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '260px 1fr', background: 'var(--obsidian)' }}>

      {/* Sidebar */}
      <aside style={sidebarStyle}>
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
              {isAdmin ? 'Admin' : 'Member'}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 16px', flex: 1 }}>
          {navItems.map(item => {
            const isActive = item.id === 'announcements'
            return (
              <Link key={item.id} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 3, marginBottom: 4, textDecoration: 'none', background: isActive ? 'rgba(139,26,26,0.2)' : 'transparent', border: isActive ? '1px solid rgba(139,26,26,0.3)' : '1px solid transparent', color: isActive ? 'var(--snow)' : 'var(--mist)', fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                {item.id === 'dashboard' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>}
                {item.id === 'announcements' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10.5V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h8"/><polyline points="22,10.5 22,22 16,19 10,22 10,10.5"/><line x1="6" y1="10" x2="18" y2="10"/><line x1="6" y1="14" x2="10" y2="14"/></svg>}
                {item.id === 'profile' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                {item.id === 'gallery' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>}
                {item.label}
                {item.id === 'announcements' && list.length > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--crimson)', color: 'var(--snow)', borderRadius: 10, padding: '1px 7px', fontSize: 9, fontFamily: "'Cinzel', serif" }}>{list.length}</span>
                )}
              </Link>
            )
          })}
          {isAdmin && (
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 3, marginBottom: 4, textDecoration: 'none', background: 'transparent', border: '1px solid transparent', color: 'var(--mist)', fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              Panel Admin
            </Link>
          )}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ display: 'grid', gridTemplateColumns: '340px 1fr', height: '100vh', overflow: 'hidden' }}>

        {/* Announcement List Panel */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', height: '100vh' }}>

          {/* List header */}
          <div style={{ padding: '32px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <div className="section-eyebrow" style={{ marginBottom: 4 }}>Internal</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--snow)', lineHeight: 1 }}>Announcement</h1>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: showForm ? 'var(--crimson)' : 'rgba(139,26,26,0.2)', border: '1px solid rgba(139,26,26,0.4)', color: 'var(--snow)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
                  title="Buat Announcement"
                >
                  {showForm ? '×' : '+'}
                </button>
              )}
            </div>
            <div style={{ fontSize: 13, color: 'var(--smoke)', fontStyle: 'italic', marginTop: 8 }}>{list.length} pengumuman</div>
          </div>

          {/* Post form (admin only) */}
          {isAdmin && showForm && (
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(201,169,110,0.15)', background: 'rgba(139,26,26,0.06)', flexShrink: 0 }}>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Judul pengumuman..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, padding: '10px 14px', color: 'var(--snow)', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.1em', outline: 'none', marginBottom: 10, boxSizing: 'border-box' }}
              />
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Isi pengumuman..."
                rows={4}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, padding: '10px 14px', color: 'var(--snow)', fontFamily: "'EB Garamond', serif", fontSize: 15, outline: 'none', marginBottom: 10, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--mist)', textTransform: 'uppercase' }}>
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))}
                    style={{ accentColor: 'var(--crimson)', width: 14, height: 14 }}
                  />
                  Pin
                </label>
                <button
                  onClick={handlePost}
                  disabled={saving || !form.title.trim() || !form.content.trim()}
                  style={{ background: saving ? 'rgba(139,26,26,0.4)' : 'var(--crimson)', color: 'var(--snow)', border: 'none', borderRadius: 2, padding: '8px 20px', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {sorted.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--smoke)', fontStyle: 'italic', fontSize: 14 }}>
                Belum ada pengumuman.
              </div>
            )}
            {sorted.map(ann => (
              <div
                key={ann.id}
                onClick={() => setSelected(ann)}
                style={{
                  padding: '20px 28px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  background: selected?.id === ann.id ? 'rgba(139,26,26,0.12)' : 'transparent',
                  borderLeft: selected?.id === ann.id ? '2px solid var(--crimson)' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                    {ann.pinned && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--gold)" style={{ flexShrink: 0 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    )}
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.1em', color: ann.pinned ? 'var(--gold)' : 'var(--snow)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ann.title}
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(ann.id) }}
                      disabled={deleting === ann.id}
                      style={{ background: 'none', border: 'none', color: 'var(--smoke)', cursor: 'pointer', padding: '0 2px', fontSize: 14, flexShrink: 0, opacity: deleting === ann.id ? 0.4 : 1 }}
                      title="Hapus"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--mist)', lineHeight: 1.5, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ann.content}
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.15em', color: 'var(--smoke)', textTransform: 'uppercase' }}>
                  {formatDate(ann.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div style={{ padding: '48px 56px', overflowY: 'auto', height: '100vh' }}>
          {!selected ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                <path d="M22 10.5V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h8"/>
                <polyline points="22,10.5 22,22 16,19 10,22 10,10.5"/>
              </svg>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase' }}>Pilih pengumuman</div>
            </div>
          ) : (
            <div style={{ maxWidth: 680 }}>
              {selected.pinned && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 2, padding: '4px 12px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>Dipinned</span>
                </div>
              )}

              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 300, color: 'var(--snow)', lineHeight: 1.2, marginBottom: 20 }}>
                {selected.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,26,26,0.3)', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 12, color: 'var(--gold)', flexShrink: 0 }}>
                    {selected.authorName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--pearl)', textTransform: 'uppercase' }}>{selected.authorName}</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.1em', color: 'var(--smoke)', marginTop: 1 }}>
                      {formatDate(selected.createdAt)} · {formatTime(selected.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: 'var(--pearl)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>
                {selected.content}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
