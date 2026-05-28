'use client'
// app/pendaftaran/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'

type Step = 1 | 2 | 3

export default function PendaftaranPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    birthDate: '', city: '', profession: '', institution: '',
    division: '', motivation: '', contribution: '', referral: '',
    portfolio: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      alert('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['Data Pribadi', 'Motivasi', 'Konfirmasi']

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

  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' }

  if (submitted) {
    return (
      <>
        <div className="noise-overlay" />
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--obsidian)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,26,26,0.2) 0%, transparent 70%)' }} />
          <div style={{
            position: 'relative', zIndex: 2,
            maxWidth: 560, textAlign: 'center', padding: 60,
            border: '1px solid rgba(201,169,110,0.2)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ width: 80, height: 80, border: '1.5px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', background: 'radial-gradient(circle, rgba(139,26,26,0.3) 0%, transparent 70%)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: 'var(--snow)', marginBottom: 16 }}>
              Permohonan <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Terkirim</em>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--mist)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 40 }}>
              Terima kasih telah mendaftar ke Arcanum Circle. Tim kami akan meninjau permohonanmu dan menghubungi kamu dalam 3–5 hari kerja.
            </p>
            <button className="btn-primary" onClick={() => router.push('/')}>Kembali ke Beranda</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="noise-overlay" />
      <Navbar />

      <div style={{ paddingTop: 80 }}>
        {/* Header */}
        <div style={{ position: 'relative', padding: '80px 60px 60px', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139,26,26,0.15) 0%, transparent 70%)' }} />
          <div className="section-eyebrow" style={{ marginBottom: 16, position: 'relative' }}>Membership</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: 'var(--snow)', position: 'relative', letterSpacing: '-0.01em' }}>
            Formulir <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Pendaftaran</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--mist)', marginTop: 16, fontStyle: 'italic', position: 'relative' }}>
            Langkah pertama menuju komunitas yang bermakna
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40, position: 'relative' }}>
            {steps.map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    border: `1px solid ${i + 1 <= step ? 'var(--crimson)' : 'rgba(255,255,255,0.1)'}`,
                    background: i + 1 < step ? 'var(--crimson)' : i + 1 === step ? 'rgba(139,26,26,0.2)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Cinzel', serif", fontSize: 12,
                    color: i + 1 <= step ? 'var(--snow)' : 'var(--smoke)',
                    transition: 'all 0.3s',
                  }}>
                    {i + 1 < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.15em', color: i + 1 <= step ? 'var(--gold)' : 'var(--smoke)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ width: 80, height: 1, background: i + 1 < step ? 'var(--crimson)' : 'rgba(255,255,255,0.1)', marginBottom: 24, transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 80px' }}>

          {/* Step 1: Data Pribadi */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 12 }}>
                Informasi Pribadi
                <span style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={fieldStyle}><label style={labelStyle}>Nama Depan</label><input style={inputStyle} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Nama depan" /></div>
                <div style={fieldStyle}><label style={labelStyle}>Nama Belakang</label><input style={inputStyle} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Nama belakang" /></div>
                <div style={fieldStyle}><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" /></div>
                <div style={fieldStyle}><label style={labelStyle}>Nomor Telepon</label><input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+62 8xx-xxxx-xxxx" /></div>
                <div style={fieldStyle}><label style={labelStyle}>Tanggal Lahir</label><input style={inputStyle} type="date" value={form.birthDate} onChange={e => set('birthDate', e.target.value)} /></div>
                <div style={fieldStyle}><label style={labelStyle}>Kota Domisili</label><input style={inputStyle} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Jakarta, Bandung, dll." /></div>
              </div>

              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                Latar Belakang
                <span style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={fieldStyle}><label style={labelStyle}>Pekerjaan / Profesi</label><input style={inputStyle} value={form.profession} onChange={e => set('profession', e.target.value)} placeholder="Software Engineer, Designer, dll." /></div>
                <div style={fieldStyle}><label style={labelStyle}>Institusi / Perusahaan</label><input style={inputStyle} value={form.institution} onChange={e => set('institution', e.target.value)} placeholder="Nama perusahaan atau kampus" /></div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Divisi yang Diminati</label>
                <select style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer' }} value={form.division} onChange={e => set('division', e.target.value)}>
                  <option value="">Pilih divisi...</option>
                  <option value="CREATIVE">Creative & Design</option>
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="BUSINESS">Business Development</option>
                  <option value="OPERATIONS">Operations</option>
                  <option value="CONTENT">Content & Media</option>
                  <option value="FINANCE">Finance</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Motivasi */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 12 }}>
                Motivasi & Visi
                <span style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Mengapa Ingin Bergabung?</label>
                <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.motivation} onChange={e => set('motivation', e.target.value)} placeholder="Ceritakan alasanmu ingin bergabung dengan Arcanum Circle..." />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Apa yang Bisa Kamu Kontribusikan?</label>
                <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.contribution} onChange={e => set('contribution', e.target.value)} placeholder="Skill, pengalaman, atau keahlian yang relevan..." />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Bagaimana Kamu Mengenal Circle Ini?</label>
                <select style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', cursor: 'pointer' }} value={form.referral} onChange={e => set('referral', e.target.value)}>
                  <option value="">Pilih sumber...</option>
                  <option>Rekomendasi Teman / Anggota</option>
                  <option>Instagram / Social Media</option>
                  <option>Website</option>
                  <option>Event / Gathering</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Link Portfolio / LinkedIn (Opsional)</label>
                <input style={inputStyle} value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="https://" />
              </div>
            </div>
          )}

          {/* Step 3: Konfirmasi */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 12 }}>
                Konfirmasi Data
                <span style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
              </div>
              {[
                { label: 'Nama Lengkap', value: `${form.firstName} ${form.lastName}` },
                { label: 'Email', value: form.email },
                { label: 'Kota', value: form.city },
                { label: 'Profesi', value: form.profession },
                { label: 'Institusi', value: form.institution },
                { label: 'Divisi', value: form.division },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase' }}>{item.label}</span>
                  <span style={{ fontSize: 16, color: 'var(--pearl)', fontFamily: "'EB Garamond', serif" }}>{item.value || '—'}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: 20, border: '1px solid rgba(201,169,110,0.15)', background: 'rgba(201,169,110,0.03)' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>Motivasi</div>
                <p style={{ fontSize: 15, color: 'var(--pearl)', fontStyle: 'italic', lineHeight: 1.7 }}>{form.motivation || '—'}</p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 8 }}>
                <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--crimson)', marginTop: 3, cursor: 'pointer', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'var(--mist)', lineHeight: 1.6 }}>
                  Saya menyetujui <span style={{ color: 'var(--gold)' }}>Syarat & Ketentuan</span> serta <span style={{ color: 'var(--gold)' }}>Kebijakan Privasi</span> Arcanum Circle
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 48 }}>
            {step > 1 && (
              <button className="btn-outline" onClick={() => setStep(s => (s - 1) as Step)}>← Kembali</button>
            )}
            {step < 3 ? (
              <button className="btn-primary" onClick={() => setStep(s => (s + 1) as Step)}>Lanjutkan →</button>
            ) : (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 240 }}
              >
                {loading ? 'Mengirim...' : 'Kirim Permohonan'}
              </button>
            )}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--smoke)', marginTop: 16, fontStyle: 'italic' }}>
            Proses review memakan waktu 3–5 hari kerja
          </p>
        </div>
      </div>
    </>
  )
}
