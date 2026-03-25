'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    background: 'var(--surface)',
    fontSize: 15,
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56 }}>
        <section
          style={{
            maxWidth: 600,
            margin: '0 auto',
            padding: '64px 20px 80px',
          }}
        >
          <p
            className="fade-up fade-up-1"
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              marginBottom: 20,
            }}
          >
            Get in touch
          </p>
          <h1
            className="fade-up fade-up-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 7vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            Start a project
          </h1>
          <p
            className="fade-up fade-up-3"
            style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 40, lineHeight: 1.7 }}
          >
            Tell me about your app idea. I&apos;ll get back to you within 24 hours with a clear answer on
            whether I can help and what it would take.
          </p>

          {status === 'sent' ? (
            <div
              style={{
                padding: '40px 24px',
                background: 'var(--live-bg)',
                borderRadius: 16,
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  color: 'var(--live-text)',
                  marginBottom: 8,
                }}
              >
                Message sent!
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
                I&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="fade-up fade-up-4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>
                  Your name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => ((e.target as HTMLElement).style.borderColor = 'var(--border-strong)')}
                  onBlur={e => ((e.target as HTMLElement).style.borderColor = 'var(--border)')}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={e => ((e.target as HTMLElement).style.borderColor = 'var(--border-strong)')}
                  onBlur={e => ((e.target as HTMLElement).style.borderColor = 'var(--border)')}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>
                  Tell me about your app idea
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="I need an app that..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => ((e.target as HTMLElement).style.borderColor = 'var(--border-strong)')}
                  onBlur={e => ((e.target as HTMLElement).style.borderColor = 'var(--border)')}
                />
              </div>

              {status === 'error' && (
                <p style={{ fontSize: 13, color: 'var(--draft-text)' }}>
                  Something went wrong — please try again or email directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  background: 'var(--text)',
                  color: 'var(--bg)',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  cursor: status === 'sending' ? 'wait' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {status === 'sending' ? 'Sending…' : 'Send message →'}
              </button>
            </form>
          )}
        </section>
      </main>
    </>
  )
}
