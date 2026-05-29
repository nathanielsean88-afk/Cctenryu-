// app/login/page.tsx
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Visual Side */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0f0505 0%, #1a0808 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(139,26,26,0.25) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {[300, 500, 700].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: '1px solid rgba(201,169,110,0.1)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 1 - i * 0.3,
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80,
            border: '1.5px solid var(--gold)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            background: 'radial-gradient(circle, rgba(139,26,26,0.4) 0%, transparent 70%)',
            overflow: 'hidden',
          }}>
            <Image src="/logo.png" alt="Tenryu Circle" width={68} height={68} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(201,169,110,0.5))' }} />
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: 'var(--snow)', lineHeight: 1.1, marginBottom: 16 }}>
            Selamat Datang<br /><em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Kembali</em>
          </h1>

          <p style={{ fontSize: 16, color: 'var(--pearl)', fontStyle: 'italic', maxWidth: 320, lineHeight: 1.8 }}>
            Akses eksklusif untuk anggota Tenryu Circle. Login untuk melanjutkan perjalananmu.
          </p>

          <div style={{ marginTop: 48, padding: '24px', borderLeft: '2px solid var(--crimson)', textAlign: 'left' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: 'var(--pearl)', lineHeight: 1.7 }}>
              "Komunitas terbaik bukan yang terbesar, melainkan yang paling tulus."
            </p>
            <cite style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', marginTop: 12 }}>
              — Tenryu Manifesto
            </cite>
          </div>
        </div>
      </div>

      {/* Clerk SignIn Side */}
      <div style={{
        background: 'var(--dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 70px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: 'var(--snow)', marginBottom: 8 }}>
            Masuk
          </h2>
          <p style={{ fontSize: 15, color: 'var(--mist)', marginBottom: 36, fontStyle: 'italic' }}>
            Login dengan akun Tenryu Circle kamu
          </p>

          <SignIn
            appearance={{
              elements: {
                rootBox: { width: '100%' },
                card: {
                  background: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                  padding: 0,
                },
                headerTitle: { display: 'none' },
                headerSubtitle: { display: 'none' },
                socialButtonsBlockButton: {
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--pearl)',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderRadius: 2,
                  padding: '12px',
                  marginBottom: 8,
                },
                socialButtonsBlockButtonText: { color: 'var(--pearl)' },
                dividerLine: { background: 'rgba(255,255,255,0.08)' },
                dividerText: { color: 'var(--smoke)', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em' },
                formFieldLabel: {
                  color: 'var(--mist)',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                },
                formFieldInput: {
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  color: 'var(--snow)',
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 16,
                },
                formButtonPrimary: {
                  background: 'var(--crimson)',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  borderRadius: 2,
                  padding: '14px',
                },
                footerActionLink: { color: 'var(--crimson-light)' },
                identityPreviewText: { color: 'var(--pearl)' },
                identityPreviewEditButton: { color: 'var(--gold)' },
              },
            }}
          />
        </div>
      </div>

      <style>{`
        body { background: var(--obsidian); }
      `}</style>
    </div>
  )
}
