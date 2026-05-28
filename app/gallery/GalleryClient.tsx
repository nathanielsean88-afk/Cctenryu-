'use client'
// app/gallery/GalleryClient.tsx
import { useState } from 'react'
import Image from 'next/image'

type Member = {
  id: string
  name: string
  imageUrl: string | null
  division: string | null
  bio: string | null
  joinedAt: Date
  application: {
    profession: string | null
    institution: string | null
    portfolio: string | null
  } | null
}

const DIVISION_LABELS: Record<string, string> = {
  CREATIVE: 'Creative',
  TECHNOLOGY: 'Technology',
  BUSINESS: 'Business',
  OPERATIONS: 'Operations',
  CONTENT: 'Content',
  FINANCE: 'Finance',
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function GalleryClient({ members }: { members: Member[] }) {
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState<Member | null>(null)

  const divisions = ['ALL', ...Object.keys(DIVISION_LABELS)]
  const filtered = filter === 'ALL' ? members : members.filter(m => m.division === filter)

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Header */}
      <div style={{ position: 'relative', padding: '80px 60px 60px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139,26,26,0.15) 0%, transparent 70%)' }} />
        <div className="section-eyebrow" style={{ marginBottom: 16, position: 'relative' }}>Komunitas</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: 'var(--snow)', position: 'relative' }}>
          Galeri <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Anggota</em>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--mist)', marginTop: 16, fontStyle: 'italic', position: 'relative' }}>
          Individu-individu luar biasa yang membentuk Tenryu Circle
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '0 0 40px', flexWrap: 'wrap', padding: '0 40px' }}>
        {divisions.map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            style={{
              padding: '8px 24px',
              fontFamily: "'Cinzel', serif",
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: `1px solid ${filter === d ? 'var(--crimson)' : 'rgba(255,255,255,0.1)'}`,
              background: filter === d ? 'rgba(139,26,26,0.15)' : 'transparent',
              color: filter === d ? 'var(--snow)' : 'var(--mist)',
              cursor: 'pointer',
              borderRadius: 2,
              transition: 'all 0.3s',
            }}
          >
            {d === 'ALL' ? 'Semua' : DIVISION_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 24,
        padding: '0 60px 80px',
        maxWidth: 1400,
        margin: '0 auto',
      }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: 'var(--mist)', fontStyle: 'italic' }}>
            Belum ada anggota di divisi ini.
          </div>
        )}
        {filtered.map(m => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            style={{
              background: 'var(--dark-2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 3,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.4s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'rgba(201,169,110,0.3)'
              el.style.transform = 'translateY(-4px)'
              el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.borderColor = 'rgba(255,255,255,0.06)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            {/* Photo */}
            <div style={{ position: 'relative', height: 280, background: 'var(--dark-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {m.imageUrl ? (
                <Image src={m.imageUrl} alt={m.name} fill style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 300, color: 'rgba(139,26,26,0.4)' }}>
                  {getInitials(m.name)}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(0deg, var(--dark-2) 0%, transparent 100%)' }} />
              {m.division && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'var(--crimson)',
                  padding: '4px 12px',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 9, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--snow)',
                  borderRadius: 1, zIndex: 2,
                }}>
                  {DIVISION_LABELS[m.division] ?? m.division}
                </div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: 'var(--snow)', marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 14 }}>
                {m.application?.profession ?? 'Member'}
                {m.application?.institution ? ` · ${m.application.institution}` : ''}
              </div>
              {m.bio && (
                <div style={{ fontSize: 14, color: 'var(--mist)', lineHeight: 1.7, fontStyle: 'italic' }}>{m.bio}</div>
              )}
              <div style={{ marginTop: 12, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase' }}>
                Bergabung {new Date(m.joinedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,169,110,0.2)', maxWidth: 560, width: '90%', maxHeight: '80vh', overflowY: 'auto', padding: 48, position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 20, right: 20, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--mist)', fontSize: 20, background: 'none', border: 'none' }}>×</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--crimson-light)', background: 'var(--dark-3)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                {selected.imageUrl ? <Image src={selected.imageUrl} alt={selected.name} fill style={{ objectFit: 'cover' }} /> : getInitials(selected.name)}
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--snow)' }}>{selected.name}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: 4 }}>
                  {selected.application?.profession ?? 'Member'} · {selected.division ? DIVISION_LABELS[selected.division] : ''}
                </div>
              </div>
            </div>

            {selected.bio && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Bio</div>
                <div style={{ fontSize: 15, color: 'var(--pearl)', lineHeight: 1.7, fontStyle: 'italic' }}>{selected.bio}</div>
              </div>
            )}

            {selected.application?.institution && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Institusi</div>
                <div style={{ fontSize: 15, color: 'var(--pearl)' }}>{selected.application.institution}</div>
              </div>
            )}

            {selected.application?.portfolio && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Portfolio</div>
                <a href={selected.application.portfolio} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: 'var(--gold)', textDecoration: 'none' }}>{selected.application.portfolio}</a>
              </div>
            )}

            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Bergabung Sejak</div>
              <div style={{ fontSize: 15, color: 'var(--pearl)' }}>{new Date(selected.joinedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
