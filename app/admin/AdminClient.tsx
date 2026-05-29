'use client'
import { useState } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Application = {
  id: string; firstName: string; lastName: string; email: string; phone: string
  division: string; motivation: string; contribution: string; referral: string
  profession: string; institution: string; portfolio: string | null
  status: string; adminNote: string | null; createdAt: Date
  nama?: string; whatsapp?: string; discord?: string; tiktok?: string
  umur?: string; asalKota?: string; ccSebelumnya?: string
  alasanKeluar?: string; alasanMasuk?: string
}
type Member = { id: string; name: string; email: string; division: string | null; joinedAt: Date; clerkId: string }
type Announcement = { id: string; title: string; content: string; createdAt: Date }
type Props = {
  applications: Application[]; members: Member[]
  announcements: Announcement[]
  stats: { total: number; pending: number; approved: number; rejected: number }
}

export default function AdminClient({ applications, members, announcements, stats }: Props) {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState<'applications' | 'members' | 'announcements'>('applications')
  const [selected, setSelected] = useState<Application | null>(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState('')
  const [toast, setToast] = useState<{ title: string; desc: string } | null>(null)
  const [newAnn, setNewAnn] = useState({ title: '', content: '' })

  const showToast = (title: string, desc: string) => {
    setToast({ title, desc })
    setTimeout(() => setToast(null), 3500)
  }

  const updateApp = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setLoading(id)
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      showToast(status === 'APPROVED' ? 'Disetujui ✓' : 'Ditolak', status === 'APPROVED' ? 'Member baru disetujui.' : 'Permohonan ditolak.')
      setSelected(null)
      router.refresh()
    } catch { showToast('Error', 'Gagal. Coba lagi.') }
    finally { setLoading('') }
  }

  const postAnn = async () => {
    if (!newAnn.title || !newAnn.content) return
    try {
      const res = await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAnn) })
      if (!res.ok) throw new Error()
      showToast('Posted!', 'Pengumuman berhasil diposting.')
      setNewAnn({ title: '', content: '' })
      router.refresh()
    } catch { showToast('Error', 'Gagal posting.') }
  }

  const filteredApps = statusFilter === 'ALL' ? applications : applications.filter(a => a.status === statusFilter)

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2, padding: '12px 16px', color: 'var(--snow)',
    fontFamily: "'EB Garamond', serif", fontSize: 16, outline: 'none', width: '100%',
  }

  const navItems = [
    { id: 'applications' as const, label: `Permohonan${stats.pending > 0 ? ` (${stats.pending})` : ''}` },
    { id: 'members' as const, label: `Anggota (${stats.total})` },
    { id: 'announcements' as const, label: 'Pengumuman' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--obsidian)' }}>
      <style>{`
        .admin-layout { display: grid; grid-template-columns: 1fr; }
        .admin-sidebar { display: none; }
        .admin-topbar { display: flex !important; }
        @media(min-width: 768px) {
          .admin-layout { grid-template-columns: 240px 1fr; }
          .admin-sidebar { display: block !important; }
          .admin-topbar { display: none !important; }
        }
        .stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; margin-bottom: 32px; }
        @media(min-width: 640px) { .stats-grid { grid-template-columns: repeat(4,1fr); } }
        .app-table-header { display: none; }
        @media(min-width: 768px) { .app-table-header { display: grid !important; } }
      `}</style>

      <div className="admin-layout">
        {/* Sidebar desktop */}
        <aside className="admin-sidebar" style={{ background: 'var(--dark-2)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '32px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px 24px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Image src="/logo.png" alt="Tenryu" width={26} height={26} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: 'var(--snow)' }}>TENRYU</div>
          </Link>
          <div style={{ padding: '0 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
            <UserButton appearance={{ elements: { avatarBox: { width: 36, height: 36, border: '1.5px solid var(--gold)' } } }} />
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,26,26,0.2)', border: '1px solid rgba(139,26,26,0.4)', padding: '4px 10px', borderRadius: 2, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.15em', color: 'var(--crimson-light)', textTransform: 'uppercase' }}>★ Admin</div>
          </div>
          <nav style={{ padding: '0 12px' }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 12px', borderRadius: 2, marginBottom: 2, border: 'none', cursor: 'pointer', background: activeNav === item.id ? 'rgba(139,26,26,0.2)' : 'transparent', borderLeft: activeNav === item.id ? '2px solid var(--crimson)' : '2px solid transparent', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: activeNav === item.id ? 'var(--snow)' : 'var(--mist)', transition: 'all 0.2s' }}>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile topbar */}
        <div className="admin-topbar" style={{ background: 'var(--dark-2)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/logo.png" alt="Tenryu" width={26} height={26} style={{ objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: 'var(--snow)' }}>Admin Panel</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ padding: '6px 10px', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid ${activeNav === item.id ? 'var(--crimson)' : 'rgba(255,255,255,0.1)'}`, background: activeNav === item.id ? 'rgba(139,26,26,0.15)' : 'transparent', color: activeNav === item.id ? 'var(--snow)' : 'var(--mist)', cursor: 'pointer', borderRadius: 2 }}>
                {item.id === 'applications' ? `Form${stats.pending > 0 ? `(${stats.pending})` : ''}` : item.id === 'members' ? 'Member' : 'Post'}
              </button>
            ))}
            <UserButton appearance={{ elements: { avatarBox: { width: 30, height: 30, border: '1.5px solid var(--gold)' } } }} />
          </div>
        </div>

        {/* Main */}
        <main style={{ padding: 'clamp(20px, 4vw, 48px) clamp(16px, 4vw, 48px)', overflowY: 'auto' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>Panel Kontrol</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 300, color: 'var(--snow)' }}>
              Manajemen <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Anggota</em>
            </div>
          </div>

          <div className="stats-grid">
            {[
              { label: 'Total Anggota', value: stats.total, color: 'var(--snow)' },
              { label: 'Pending', value: stats.pending, color: 'var(--gold)' },
              { label: 'Disetujui', value: stats.approved, color: '#6dbf6d' },
              { label: 'Ditolak', value: stats.rejected, color: 'var(--crimson-light)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px 16px', position: 'relative', borderRadius: 3 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: 'var(--crimson)' }} />
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: s.color, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Applications */}
          {activeNav === 'applications' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: 'var(--snow)' }}>Permohonan Masuk</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '5px 12px', fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid ${statusFilter === s ? 'var(--crimson)' : 'rgba(255,255,255,0.1)'}`, background: statusFilter === s ? 'rgba(139,26,26,0.15)' : 'transparent', color: statusFilter === s ? 'var(--snow)' : 'var(--mist)', cursor: 'pointer', borderRadius: 2 }}>
                      {s === 'ALL' ? 'Semua' : s === 'PENDING' ? 'Pending' : s === 'APPROVED' ? 'Terima' : 'Tolak'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                {filteredApps.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'var(--mist)', fontStyle: 'italic' }}>Tidak ada permohonan.</div>}
                {filteredApps.map(a => (
                  <div key={a.id} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: 'var(--snow)' }}>{(a as any).nama || `${a.firstName} ${a.lastName}`}</div>
                      <div style={{ fontSize: 12, color: 'var(--mist)', marginTop: 2 }}>{(a as any).whatsapp ? `WA: ${(a as any).whatsapp}` : a.email}</div>
                      <div style={{ marginTop: 6 }}>
                        <span className={`badge-${a.status.toLowerCase()}`}>{a.status === 'PENDING' ? 'Pending' : a.status === 'APPROVED' ? 'Diterima' : 'Ditolak'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setSelected(a)} style={{ padding: '6px 12px', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(201,169,110,0.3)', color: 'var(--gold)', background: 'transparent' }}>Detail</button>
                      {a.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateApp(a.id, 'APPROVED')} disabled={loading === a.id} style={{ padding: '6px 12px', fontFamily: "'Cinzel', serif", fontSize: 9, borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(34,139,34,0.4)', color: '#6dbf6d', background: 'rgba(34,139,34,0.08)' }}>✓</button>
                          <button onClick={() => updateApp(a.id, 'REJECTED')} disabled={loading === a.id} style={{ padding: '6px 12px', fontFamily: "'Cinzel', serif", fontSize: 9, borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(139,26,26,0.4)', color: 'var(--crimson-light)', background: 'rgba(139,26,26,0.08)' }}>✗</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Members */}
          {activeNav === 'members' && (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: 'var(--snow)', marginBottom: 16 }}>Daftar Anggota</div>
              <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                {members.map(m => (
                  <div key={m.id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: 'var(--snow)' }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--smoke)' }}>{new Date(m.joinedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Announcements */}
          {activeNav === 'announcements' && (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: 'var(--snow)', marginBottom: 20 }}>Buat Pengumuman</div>
              <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: 24, borderRadius: 3, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Judul</label>
                  <input style={inputStyle} value={newAnn.title} onChange={e => setNewAnn(a => ({ ...a, title: e.target.value }))} placeholder="Judul pengumuman..." /></div>
                <div><label style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Isi</label>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={newAnn.content} onChange={e => setNewAnn(a => ({ ...a, content: e.target.value }))} placeholder="Isi pengumuman..." /></div>
                <button className="btn-primary" onClick={postAnn} style={{ alignSelf: 'flex-start' }}>Post</button>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: 'var(--snow)', marginBottom: 14 }}>Sebelumnya</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {announcements.map(a => (
                  <div key={a.id} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', borderRadius: 3 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: 'var(--snow)', marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 6 }}>{new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div style={{ fontSize: 13, color: 'var(--mist)', fontStyle: 'italic' }}>{a.content}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: 16 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,169,110,0.2)', maxWidth: 560, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: 'clamp(24px, 4vw, 40px)', position: 'relative', borderRadius: 3 }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--mist)', fontSize: 20, background: 'none', border: 'none' }}>×</button>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--snow)', marginBottom: 4 }}>{(selected as any).nama || `${selected.firstName} ${selected.lastName}`}</div>
            <div style={{ marginBottom: 24 }}><span className={`badge-${selected.status.toLowerCase()}`}>{selected.status === 'PENDING' ? 'Menunggu' : selected.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}</span></div>
            {[
              { label: 'WhatsApp', value: (selected as any).whatsapp },
              { label: 'Discord', value: (selected as any).discord },
              { label: 'TikTok', value: (selected as any).tiktok ? `@${(selected as any).tiktok}` : null },
              { label: 'Umur', value: (selected as any).umur ? `${(selected as any).umur} tahun` : null },
              { label: 'Asal Kota', value: (selected as any).asalKota },
              { label: 'CC Sebelumnya', value: (selected as any).ccSebelumnya },
            ].filter(i => i.value).map(item => (
              <div key={item.label} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 15, color: 'var(--pearl)' }}>{item.value}</div>
              </div>
            ))}
            {(selected as any).alasanMasuk && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Alasan Masuk</div>
                <div style={{ fontSize: 15, color: 'var(--pearl)', lineHeight: 1.7, fontStyle: 'italic', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>"{(selected as any).alasanMasuk}"</div>
              </div>
            )}
            {selected.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => updateApp(selected.id, 'APPROVED')} disabled={loading === selected.id}>
                  {loading === selected.id ? 'Memproses...' : '✓ Setujui'}
                </button>
                <button className="btn-outline" style={{ flex: 1, borderColor: 'var(--crimson)', color: 'var(--crimson-light)' }} onClick={() => updateApp(selected.id, 'REJECTED')} disabled={loading === selected.id}>
                  ✗ Tolak
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 16, left: 16, maxWidth: 320, margin: '0 auto', background: 'var(--dark-2)', border: '1px solid rgba(201,169,110,0.3)', borderLeft: '3px solid var(--gold)', padding: '14px 20px', zIndex: 9000, borderRadius: 2 }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 4 }}>{toast.title}</div>
          <div style={{ fontSize: 13, color: 'var(--pearl)' }}>{toast.desc}</div>
        </div>
      )}
    </div>
  )
}
