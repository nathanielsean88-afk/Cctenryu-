'use client'
import Link from 'next/link'
import Image from 'next/image'
import { SignOutButton } from '@clerk/nextjs'

type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | null

type ContentItem = {
  icon: React.ReactNode
  title: string
  subtitle: string
  desc: string
  action: React.ReactNode | null
}

export default function MenungguClient({ status, hasApplied }: { status: Status; hasApplied: boolean }) {

  const iconStyle = { width: 36, height: 36 }

  const contentMap: Record<string, ContentItem> = {
    NO_APP: {
      icon: <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
      title: 'Lengkapi Pendaftaran',
      subtitle: 'Kamu belum mengisi form pendaftaran',
      desc: 'Untuk bergabung dengan Tenryu Circle, isi form pendaftaran terlebih dahulu. Tim kami akan meninjau permohonanmu.',
      action: (
        <Link href="/pendaftaran" style={{ display: 'inline-block', background: 'var(--crimson)', color: 'var(--snow)', padding: '16px 48px', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, textDecoration: 'none' }}>
          Isi Form Pendaftaran
        </Link>
      ),
    },
    PENDING: {
      icon: <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
      title: 'Sedang Ditinjau',
      subtitle: 'Permohonanmu sedang diproses',
      desc: 'Tim Tenryu Circle sedang meninjau permohonan kamu. Proses ini memakan waktu 3–5 hari kerja. Kami akan menghubungi kamu via WhatsApp atau Discord.',
      action: null,
    },
    APPROVED: {
      icon: <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#6dbf6d" strokeWidth="1.5"><polyline points="20,6 9,17 4,12"/></svg>,
      title: 'Selamat, Diterima!',
      subtitle: 'Permohonanmu telah disetujui',
      desc: 'Kamu resmi menjadi anggota Tenryu Circle. Silakan login ulang untuk mengakses dashboard member.',
      action: (
        <SignOutButton redirectUrl="/login">
          <button style={{ background: 'var(--crimson)', color: 'var(--snow)', border: 'none', padding: '16px 48px', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
            Login Ulang
          </button>
        </SignOutButton>
      ),
    },
    REJECTED: {
      icon: <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="var(--crimson-light)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
      title: 'Permohonan Ditolak',
      subtitle: 'Maaf, permohonanmu tidak dapat kami terima',
      desc: 'Terima kasih atas minatmu bergabung dengan Tenryu Circle. Sayangnya permohonanmu tidak dapat kami terima pada batch ini.',
      action: null,
    },
  }

  const key = !hasApplied ? 'NO_APP' : (status ?? 'NO_APP')
  const c = contentMap[key] ?? contentMap['NO_APP']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,26,26,0.15) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, width: '90%', textAlign: 'center', padding: 56, border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(24,24,24,0.8)', backdropFilter: 'blur(12px)', borderRadius: 3 }}>

        {/* Logo */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)' }}>
            <Image src="/logo.png" alt="Tenryu" width={44} height={44} style={{ objectFit: 'contain' }} />
          </div>
        </div>

        {/* Status icon */}
        <div style={{ width: 80, height: 80, border: '1.5px solid rgba(201,169,110,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', background: 'rgba(255,255,255,0.03)' }}>
          {c.icon}
        </div>

        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>{c.subtitle}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: 'var(--snow)', marginBottom: 20, lineHeight: 1.1 }}>{c.title}</h1>
        <p style={{ fontSize: 16, color: 'var(--mist)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 40 }}>{c.desc}</p>

        {c.action && <div style={{ marginBottom: 28 }}>{c.action}</div>}

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0 24px' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <Link href="/" style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--mist)', textDecoration: 'none', textTransform: 'uppercase' }}>Beranda</Link>
          <Link href="/gallery" style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--mist)', textDecoration: 'none', textTransform: 'uppercase' }}>Galeri</Link>
          <SignOutButton redirectUrl="/">
            <button style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--mist)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>Keluar</button>
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}
