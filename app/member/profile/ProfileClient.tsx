'use client'
// app/member/profile/ProfileClient.tsx
import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  name: string
  email: string
  imageUrl: string | null
  division: string | null
  bio: string | null
  portfolio: string | null
  joinedAt: Date
  role: string
}

type Application = {
  profession: string | null
  institution: string | null
  city: string | null
  phone: string | null
} | null

const DIVISION_LABELS: Record<string, string> = {
  CREATIVE: 'Creative & Design',
  TECHNOLOGY: 'Technology',
  BUSINESS: 'Business Development',
  OPERATIONS: 'Operations',
  CONTENT: 'Content & Media',
  FINANCE: 'Finance',
}

export default function ProfileClient({ user, application }: { user: User; application: Application }) {
  const router = useRouter()
  const { user: clerkUser } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio ?? '',
    portfolio: user.portfolio ?? '',
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Ukuran foto maksimal 5MB')
      return
    }
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // 1. Update photo di Clerk jika ada file baru
      if (photoFile && clerkUser) {
        await clerkUser.setProfileImage({ file: photoFile })
      }

      // 2. Update name di Clerk jika berubah
      if (clerkUser && form.name !== user.name) {
        const parts = form.name.trim().split(' ')
        await clerkUser.update({
          firstName: parts[0],
          lastName: parts.slice(1).join(' ') || '',
        })
      }

      // 3. Update bio & portfolio di DB kita
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: form.bio,
          portfolio: form.portfolio,
          name: form.name,
        }),
      })

      if (!res.ok) throw new Error()

      showToast('success', 'Profil berhasil diperbarui!')
      router.refresh()
    } catch {
      showToast('error', 'Gagal menyimpan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const currentPhoto = preview ?? user.imageUrl ?? null

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2,
    padding: '14px 18px',
    color: 'var(--snow)',
    fontFamily: "'EB Garamond', serif",
    fontSize: 16,
    outline: 'none',
    width: '100%',
    transition: 'all 0.3s',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Cinzel', serif",
    fontSize: 10,
    letterSpacing: '0.25em',
    color: 'var(--mist)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 8,
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/member' },
    { id: 'profile', label: 'Profil Saya', href: '/member/profile' },
    { id: 'gallery', label: 'Galeri Anggota', href: '/gallery' },
    { id: 'pendaftaran', label: 'Form Pendaftaran', href: '/pendaftaran' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '260px 1fr', background: 'var(--obsidian)' }}>

      {/* Sidebar */}
      <aside style={{ background: 'var(--dark-2)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '40px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 28px 28px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, border: '1px solid rgba(201,169,110,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)' }}>
            <Image src="/logo.png" alt="Tenryu" width={30} height={30} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--snow)' }}>TENRYU</div>
        </Link>

        <div style={{ padding: '0 28px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid var(--crimson)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
            {currentPhoto ? (
              <Image src={currentPhoto} alt={user.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--dark-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--crimson-light)' }}>
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--snow)' }}>{user.name}</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: 2 }}>
              {user.division ? DIVISION_LABELS[user.division] : 'Member'}
            </div>
          </div>
        </div>

        <nav style={{ padding: '0 16px' }}>
          {navItems.map(item => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 2,
                textDecoration: 'none', marginBottom: 2,
                background: item.id === 'profile' ? 'rgba(139,26,26,0.15)' : 'transparent',
                borderLeft: item.id === 'profile' ? '2px solid var(--crimson)' : '2px solid transparent',
                fontFamily: "'Cinzel', serif", fontSize: 10,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: item.id === 'profile' ? 'var(--snow)' : 'var(--mist)',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ padding: '48px 56px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Akun Saya</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: 'var(--snow)' }}>
            Edit <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Profil</em>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 40, gap: 0 }}>
          {(['profile', 'account'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 28px',
                fontFamily: "'Cinzel', serif",
                fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--crimson)' : 'transparent'}`,
                color: activeTab === tab ? 'var(--snow)' : 'var(--mist)',
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'all 0.3s',
              }}
            >
              {tab === 'profile' ? 'Profil Publik' : 'Informasi Akun'}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Photo Upload */}
            <div>
              <label style={labelStyle}>Foto Profil</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                {/* Preview */}
                <div style={{ width: 100, height: 100, borderRadius: '50%', border: '2px solid var(--crimson)', overflow: 'hidden', position: 'relative', flexShrink: 0, background: 'var(--dark-3)', cursor: 'pointer' }}
                  onClick={() => fileInputRef.current?.click()}>
                  {currentPhoto ? (
                    <Image src={currentPhoto} alt={user.name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: 'var(--crimson-light)' }}>
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '0'}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{ ...inputStyle, width: 'auto', padding: '10px 24px', cursor: 'pointer', fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}
                  >
                    Ganti Foto
                  </button>
                  <div style={{ fontSize: 13, color: 'var(--smoke)', fontStyle: 'italic' }}>
                    JPG, PNG — Maks. 5MB<br />
                    {photoFile && <span style={{ color: 'var(--gold)' }}>✓ {photoFile.name} dipilih</span>}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>
            </div>

            {/* Nama */}
            <div>
              <label style={labelStyle}>Nama Lengkap</label>
              <input
                style={inputStyle}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Nama lengkap kamu"
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--crimson-soft)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(139,26,26,0.1)' }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.target as HTMLInputElement).style.boxShadow = 'none' }}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={labelStyle}>Bio</label>
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
                value={form.bio}
                onChange={e => set('bio', e.target.value)}
                placeholder="Ceritakan sedikit tentang dirimu. Bio ini akan tampil di galeri anggota..."
                maxLength={280}
                onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--crimson-soft)'; (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(139,26,26,0.1)' }}
                onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.target as HTMLTextAreaElement).style.boxShadow = 'none' }}
              />
              <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--smoke)', marginTop: 6 }}>
                {form.bio.length}/280
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <label style={labelStyle}>Link Portfolio / LinkedIn</label>
              <input
                style={inputStyle}
                value={form.portfolio}
                onChange={e => set('portfolio', e.target.value)}
                placeholder="https://linkedin.com/in/namakamu"
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--crimson-soft)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(139,26,26,0.1)' }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.target as HTMLInputElement).style.boxShadow = 'none' }}
              />
            </div>

            {/* Save */}
            <div style={{ display: 'flex', gap: 16, paddingTop: 8 }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  background: loading ? 'var(--smoke)' : 'var(--crimson)',
                  color: 'var(--snow)', border: 'none',
                  padding: '16px 48px',
                  fontFamily: "'Cinzel', serif", fontSize: 12,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  borderRadius: 2, transition: 'all 0.3s',
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--crimson-light)' }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--crimson)' }}
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <Link
                href="/member"
                style={{
                  padding: '16px 32px',
                  fontFamily: "'Cinzel', serif", fontSize: 12,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--pearl)', textDecoration: 'none',
                  borderRadius: 2, transition: 'all 0.3s',
                  display: 'inline-flex', alignItems: 'center',
                }}
              >
                Batal
              </Link>
            </div>
          </div>
        )}

        {/* Account Info Tab */}
        {activeTab === 'account' && (
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Read-only info */}
            {[
              { label: 'Email', value: user.email, note: 'Dikelola melalui Clerk' },
              { label: 'Divisi', value: user.division ? DIVISION_LABELS[user.division] : '—', note: 'Ditetapkan oleh admin' },
              { label: 'Role', value: user.role === 'ADMIN' ? 'Administrator' : 'Member', note: null },
              { label: 'Bergabung Sejak', value: new Date(user.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), note: null },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                  {item.note && <div style={{ fontSize: 12, color: 'var(--smoke)', fontStyle: 'italic' }}>{item.note}</div>}
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: 'var(--pearl)' }}>{item.value}</div>
              </div>
            ))}

            {/* Application info */}
            {application && (
              <>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', margin: '32px 0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  Data Pendaftaran
                  <span style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
                </div>
                {[
                  { label: 'Profesi', value: application.profession },
                  { label: 'Institusi', value: application.institution },
                  { label: 'Kota', value: application.city },
                  { label: 'Telepon', value: application.phone },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: 'var(--pearl)' }}>{item.value}</div>
                  </div>
                ))}
              </>
            )}

            {/* Clerk account management */}
            <div style={{ marginTop: 40, padding: 24, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', borderRadius: 3 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>Keamanan Akun</div>
              <p style={{ fontSize: 14, color: 'var(--mist)', fontStyle: 'italic', marginBottom: 20 }}>
                Ganti password, kelola sesi login, dan pengaturan keamanan lainnya dikelola melalui Clerk.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <UserButton
                  appearance={{ elements: { avatarBox: { width: 36, height: 36, border: '1.5px solid var(--crimson)' } } }}
                />
                <span style={{ fontSize: 14, color: 'var(--pearl)' }}>Klik ikon profil untuk pengaturan akun</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 40, right: 40,
          background: 'var(--dark-2)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(201,169,110,0.3)' : 'rgba(139,26,26,0.4)'}`,
          borderLeft: `3px solid ${toast.type === 'success' ? 'var(--gold)' : 'var(--crimson)'}`,
          padding: '16px 24px', zIndex: 9000,
          maxWidth: 320, borderRadius: 2,
          animation: 'slideIn 0.3s ease',
        }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.2em', color: toast.type === 'success' ? 'var(--gold)' : 'var(--crimson-light)', textTransform: 'uppercase', marginBottom: 4 }}>
            {toast.type === 'success' ? 'Berhasil' : 'Error'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--pearl)' }}>{toast.msg}</div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
