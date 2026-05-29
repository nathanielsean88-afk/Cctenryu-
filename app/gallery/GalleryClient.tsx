'use client'
import { useState } from 'react'
import Image from 'next/image'

type Member = {
  id: string; name: string; imageUrl: string | null
  division: string | null; bio: string | null; joinedAt: Date; application: null
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const GALLERY_VIDEO_URL = ''

export default function GalleryClient({ members }: { members: Member[] }) {
  const [selected, setSelected] = useState<Member | null>(null)

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Header */}
      <div style={{ position: 'relative', padding: 'clamp(48px, 8vw, 80px) 24px clamp(32px, 5vw, 60px)', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139,26,26,0.15) 0%, transparent 70%)' }} />
        <div className="section-eyebrow" style={{ marginBottom: 16, position: 'relative' }}>Komunitas</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 8vw, 64px)', fontWeight: 300, color: 'var(--snow)', position: 'relative' }}>
          Galeri <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Anggota</em>
        </h1>
        <p style={{ fontSize: 'clamp(14px, 3vw, 17px)', color: 'var(--mist)', marginTop: 12, fontStyle: 'italic', position: 'relative' }}>
          Individu-individu yang membentuk Tenryu Circle
        </p>
      </div>

      {/* Video Slot */}
      <div style={{ maxWidth: 860, margin: '0 auto clamp(40px, 6vw, 60px)', padding: '0 24px' }}>
        <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(201,169,110,0.2)', background: 'var(--dark-2)', aspectRatio: '16/9' }}>
          {GALLERY_VIDEO_URL ? (
            <iframe src={GALLERY_VIDEO_URL} style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'absolute', inset: 0 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><polygon points="5,3 19,12 5,21 5,3"/></svg>
              </div>
              <div style={{ textAlign: 'center', padding: '0 16px' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>Video Tenryu Circle</div>
                <div style={{ fontSize: 12, color: 'var(--smoke)', fontStyle: 'italic' }}>Isi GALLERY_VIDEO_URL di GalleryClient.tsx</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, padding: '0 24px clamp(60px, 8vw, 80px)', maxWidth: 1400, margin: '0 auto' }}>
        {members.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: 'var(--mist)', fontStyle: 'italic' }}>Belum ada anggota.</div>
        )}
        {members.map(m => (
          <div key={m.id} onClick={() => setSelected(m)}
            style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(201,169,110,0.3)'; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
          >
            <div style={{ position: 'relative', aspectRatio: '3/4', background: 'var(--dark-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {m.imageUrl
                ? <Image src={m.imageUrl} alt={m.name} fill style={{ objectFit: 'cover' }} />
                : <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: 'rgba(139,26,26,0.4)' }}>{getInitials(m.name)}</div>
              }
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(0deg, var(--dark-2) 0%, transparent 100%)' }} />
            </div>
            <div style={{ padding: '20px 20px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: 'var(--snow)', marginBottom: 8 }}>{m.name}</div>
              {m.bio && <div style={{ fontSize: 13, color: 'var(--mist)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10 }}>{m.bio}</div>}
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase' }}>
                {new Date(m.joinedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: 16 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,169,110,0.2)', maxWidth: 480, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: 'clamp(28px, 5vw, 48px)', position: 'relative', borderRadius: 3 }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--mist)', fontSize: 20, background: 'none', border: 'none' }}>×</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'var(--crimson-light)', background: 'var(--dark-3)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                {selected.imageUrl ? <Image src={selected.imageUrl} alt={selected.name} fill style={{ objectFit: 'cover' }} /> : getInitials(selected.name)}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'var(--snow)' }}>{selected.name}</div>
            </div>
            {selected.bio && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Bio</div>
                <div style={{ fontSize: 15, color: 'var(--pearl)', lineHeight: 1.7, fontStyle: 'italic' }}>{selected.bio}</div>
              </div>
            )}
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Bergabung</div>
              <div style={{ fontSize: 15, color: 'var(--pearl)' }}>{new Date(selected.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
