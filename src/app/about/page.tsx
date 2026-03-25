'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

const stack = [
  { label: 'Framework', value: 'Next.js 15' },
  { label: 'Database', value: 'Firebase / Firestore' },
  { label: 'Auth', value: 'Firebase Auth' },
  { label: 'Storage', value: 'Firebase Storage' },
  { label: 'AI', value: 'Anthropic Claude API' },
  { label: 'Styling', value: 'Tailwind CSS' },
  { label: 'Hosting', value: 'Vercel' },
  { label: 'PDF', value: 'jsPDF' },
  { label: 'Email', value: 'Nodemailer / SendGrid' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56 }}>
        <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 20px 80px' }}>

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
            The builder
          </p>

          <h1
            className="fade-up fade-up-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 7vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 32,
            }}
          >
            About
          </h1>

          <div
            className="fade-up fade-up-3"
            style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 40 }}
          >
            <p style={{ marginBottom: 20 }}>
              I build full-stack web applications — the kind that actually ship and get used. I work fast,
              communicate clearly, and I&apos;m not interested in overcomplicating things.
            </p>
            <p style={{ marginBottom: 20 }}>
              Every app I build uses a proven stack: Next.js for the frontend, Firebase for data and auth,
              and Claude AI for any smart features. That stack lets me move quickly without cutting corners.
            </p>
            <p>
              I&apos;ve built care-logging platforms, contractor estimate tools, nutrition management apps,
              and social media dashboards — each one mobile-first, production-ready, and deployed on Vercel.
            </p>
          </div>

          {/* Stack table */}
          <div
            className="fade-up fade-up-4"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 48,
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                }}
              >
                My standard stack
              </h3>
            </div>
            {stack.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderBottom: i < stack.length - 1 ? '1px solid var(--border)' : 'none',
                  fontSize: 14,
                }}
              >
                <span style={{ color: 'var(--text-3)' }}>{item.label}</span>
                <span style={{ fontWeight: 500, color: 'var(--text)' }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="fade-up fade-up-5" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              style={{
                textDecoration: 'none',
                background: 'var(--text)',
                color: 'var(--bg)',
                padding: '12px 24px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Work with me
            </Link>
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                border: '1px solid var(--border-strong)',
                color: 'var(--text)',
                padding: '12px 24px',
                borderRadius: 10,
                fontSize: 14,
              }}
            >
              See my work
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
