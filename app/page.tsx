import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,26,26,0.18) 0%, transparent 70%), linear-gradient(180deg, #080808 0%, #0f0808 50%, #080808 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {[400, 600, 800].map((size, i) => (
          <div key={i} style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.06)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: `rotateSlow ${30 + i * 15}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}` }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 720, padding: '100px 24px 60px', animation: 'fadeUp 1.2s ease forwards' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)', overflow: 'hidden', boxShadow: '0 0 40px rgba(139,26,26,0.2)' }}>
              <Image src="/logo.png" alt="Tenryu Circle" width={80} height={80} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(201,169,110,0.5))' }} />
            </div>
          </div>

          <div className="section-eyebrow" style={{ marginBottom: 20 }}>Est. 2024</div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(44px, 10vw, 96px)', fontWeight: 300, lineHeight: 1.05, color: 'var(--snow)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Tenryu</em>
            <strong style={{ display: 'block', fontWeight: 600 }}>Circle</strong>
          </h1>

          <div className="gold-divider" />

          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(16px, 4vw, 19px)', color: 'var(--pearl)', maxWidth: 480, margin: '0 auto 40px', fontStyle: 'italic', lineHeight: 1.8 }}>
            Komunitas eksklusif bagi mereka yang percaya bahwa kolaborasi sejati lahir dari kedalaman, bukan keluasan.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/pendaftaran" className="btn-primary">Bergabung Sekarang</Link>
            <Link href="/gallery" className="btn-outline">Kenali Anggota</Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.5em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              Tentang Kami <span style={{ flex: 1, height: 1, background: 'var(--gold)', opacity: 0.3, maxWidth: 60 }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, lineHeight: 1.15, color: 'var(--snow)', marginBottom: 20 }}>
              Lebih dari sekadar <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>komunitas</em>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--pearl)', lineHeight: 1.9, marginBottom: 16 }}>
              Tenryu Circle adalah ruang bagi individu-individu luar biasa untuk tumbuh bersama. Di sini, setiap koneksi punya makna.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 32 }}>
              {[{ num: '47+', label: 'Anggota' }, { num: '3', label: 'Tahun' }, { num: '12', label: 'Program' }, { num: '98%', label: 'Retensi' }].map(s => (
                <div key={s.label} style={{ padding: '20px 16px', border: '1px solid rgba(201,169,110,0.15)', background: 'rgba(255,255,255,0.02)', position: 'relative', paddingLeft: 24 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'var(--crimson)' }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: 'var(--crimson-light)', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,169,110,0.15)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(32px, 8vw, 64px)', fontWeight: 700, color: 'rgba(139,26,26,0.08)', letterSpacing: '0.3em' }}>TENRYU</span>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'var(--crimson)' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}>
                "Tempat di mana ambisi bertemu dengan integritas."
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="section-eyebrow" style={{ marginBottom: 20 }}>Bergabung</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 300, color: 'var(--snow)', marginBottom: 16 }}>
          Siap Menjadi Bagian dari <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Tenryu?</em>
        </h2>
        <p style={{ fontSize: 17, color: 'var(--mist)', fontStyle: 'italic', marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>
          Pendaftaran dibuka secara selektif. Tidak perlu akun — cukup isi form.
        </p>
        <Link href="/pendaftaran" className="btn-primary">Daftar Sekarang</Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--dark-2)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(40px, 6vw, 60px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: 'var(--snow)', marginBottom: 8 }}>Tenryu Circle</div>
            <div style={{ fontSize: 14, color: 'var(--mist)', lineHeight: 1.7, fontStyle: 'italic' }}>Komunitas eksklusif untuk kolaborasi yang bermakna.</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 14 }}>Navigasi</div>
            {['Beranda', 'Anggota', 'Pendaftaran'].map(l => <div key={l} style={{ fontSize: 14, color: 'var(--mist)', marginBottom: 8 }}>{l}</div>)}
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 14 }}>Legal</div>
            {['Syarat & Ketentuan', 'Kebijakan Privasi', 'FAQ'].map(l => <div key={l} style={{ fontSize: 14, color: 'var(--mist)', marginBottom: 8 }}>{l}</div>)}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '24px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase' }}>© 2026 Tenryu Circle</p>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase' }}>Crafted with intention</p>
        </div>
      </footer>

      <style>{`
        @keyframes pulseOrb { 0%,100%{opacity:.8;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)} }
        @keyframes rotateSlow { from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  )
}
