// app/register/page.tsx
import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--obsidian)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(139,26,26,0.15) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 480, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56,
            border: '1.5px solid var(--gold)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            background: 'radial-gradient(circle, rgba(139,26,26,0.3) 0%, transparent 70%)',
            overflow: 'hidden',
          }}>
            <Image src="/logo.png" alt="Tenryu Circle" width={48} height={48} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(201,169,110,0.4))' }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: 'var(--snow)', marginBottom: 8 }}>
            Buat Akun
          </h1>
          <p style={{ fontSize: 15, color: 'var(--mist)', fontStyle: 'italic' }}>
            Langkah pertama menuju Tenryu Circle
          </p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: { width: '100%' },
              card: {
                background: 'var(--dark-2)',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
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
              },
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
              },
              footerActionLink: { color: 'var(--crimson-light)' },
            },
          }}
        />
      </div>
    </div>
  )
}
