'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useUser()
  const role = (user?.publicMetadata?.role as string) ?? null
  const isApproved = role === 'MEMBER' || role === 'ADMIN'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const linkStyle = (href: string): React.CSSProperties => ({
    fontFamily: "'Cinzel', serif", fontSize: 11,
    letterSpacing: '0.2em', textTransform: 'uppercase',
    textDecoration: 'none',
    color: pathname === href || pathname.startsWith(href + '/') ? 'var(--gold)' : 'var(--pearl)',
    transition: 'color 0.3s', padding: '8px 0',
  })

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'rgba(8,8,8,0.97)' : 'linear-gradient(180deg, rgba(8,8,8,0.95) 0%, transparent 100%)',
        borderBottom: scrolled ? '1px solid rgba(201,169,110,0.1)' : 'none',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        transition: 'all 0.4s',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(139,26,26,0.25) 0%, transparent 70%)', border: '1px solid rgba(201,169,110,0.3)', overflow: 'hidden', flexShrink: 0 }}>
            <Image src="/logo.png" alt="Tenryu" width={34} height={34} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(201,169,110,0.4))' }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--snow)' }}>TENRYU</div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase' }}>Circle</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', alignItems: 'center', gap: 32 }} className="desktop-nav">
          <Link href="/" style={linkStyle('/')}>Beranda</Link>
          <Link href="/gallery" style={linkStyle('/gallery')}>Anggota</Link>
          <SignedOut>
            <Link href="/pendaftaran" style={linkStyle('/pendaftaran')}>Pendaftaran</Link>
          </SignedOut>
          <SignedIn>
            {!isApproved && <Link href="/pendaftaran" style={linkStyle('/pendaftaran')}>Pendaftaran</Link>}
            {isApproved && <Link href="/member" style={linkStyle('/member')}>Announcement</Link>}
            {role === 'ADMIN' && <Link href="/admin" style={linkStyle('/admin')}>Admin</Link>}
          </SignedIn>
          <SignedOut>
            <Link href="/login" style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--snow)', border: '1px solid var(--crimson-soft)', padding: '8px 20px', borderRadius: 2 }}>
              Masuk
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: { width: 34, height: 34, border: '1.5px solid var(--crimson)' } } }} />
          </SignedIn>
        </nav>

        {/* Mobile: Auth + Burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="mobile-nav">
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: { width: 32, height: 32, border: '1.5px solid var(--crimson)' } } }} />
          </SignedIn>
          {/* Burger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}
          >
            <span style={{ display: 'block', width: 22, height: 1.5, background: menuOpen ? 'var(--gold)' : 'var(--pearl)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: menuOpen ? 'transparent' : 'var(--pearl)', transition: 'all 0.3s' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: menuOpen ? 'var(--gold)' : 'var(--pearl)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, zIndex: 99,
          background: 'rgba(8,8,8,0.98)',
          borderBottom: '1px solid rgba(201,169,110,0.15)',
          backdropFilter: 'blur(12px)',
          padding: '24px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {[
            { href: '/', label: 'Beranda', show: true },
            { href: '/gallery', label: 'Anggota', show: true },
            { href: '/pendaftaran', label: 'Pendaftaran', show: !isApproved },
            { href: '/member', label: 'Announcement', show: !!isApproved },
            { href: '/admin', label: 'Admin Panel', show: role === 'ADMIN' },
          ].filter(l => l.show).map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: "'Cinzel', serif", fontSize: 12,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none',
              color: pathname === l.href ? 'var(--gold)' : 'var(--pearl)',
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'block',
            }}>
              {l.label}
            </Link>
          ))}
          <SignedOut>
            <Link href="/login" style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--snow)', background: 'var(--crimson)', padding: '14px', borderRadius: 2, textAlign: 'center', display: 'block', marginTop: 12 }}>
              Masuk
            </Link>
          </SignedOut>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
