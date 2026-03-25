'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'

const services = [
  {
    emoji: '⚡',
    title: 'MVP in 2 weeks',
    description:
      'You have an idea — I build the working product. From first conversation to a live URL you can share with users.',
    details: ['Requirements & wireframe on day 1', 'Working prototype by day 7', 'Live on Vercel by day 14'],
  },
  {
    emoji: '🤖',
    title: 'AI-powered features',
    description:
      'I integrate Claude AI natively — chat assistants, voice input, smart data parsing, automated reports. Real AI that does useful things.',
    details: ['Claude API integration', 'Voice & natural language input', 'AI-generated content & reports'],
  },
  {
    emoji: '📱',
    title: 'Mobile-first web apps',
    description:
      'Apps that feel native on a phone but run in the browser. No app store needed — share a URL and it just works.',
    details: ['Phone-first design', 'PWA installable', 'Works offline (where possible)'],
  },
  {
    emoji: '🔥',
    title: 'Firebase & real-time data',
    description:
      'Authentication, database, file storage, real-time updates — all set up and production-ready from day one.',
    details: ['Firestore database', 'Firebase Auth (Google + email)', 'Cloud Storage for files'],
  },
  {
    emoji: '📄',
    title: 'Reports & PDFs',
    description:
      'Automated email reports, branded PDFs, invoice generation. Turn your data into documents your clients can actually use.',
    details: ['PDF generation (jsPDF)', 'Email delivery (SendGrid / Gmail)', 'Branded templates'],
  },
  {
    emoji: '🚀',
    title: 'Ongoing support',
    description:
      'After launch I stay available. New features, bug fixes, data migrations — we keep building as your needs grow.',
    details: ['Monthly retainer available', 'Feature additions', 'Performance & security updates'],
  },
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 56 }}>
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 20px 80px' }}>

          {/* Header */}
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
            What I build
          </p>
          <h1
            className="fade-up fade-up-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 7vw, 60px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 48,
              maxWidth: 600,
            }}
          >
            Services
          </h1>

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
              marginBottom: 64,
            }}
          >
            {services.map((s, i) => (
              <div
                key={s.title}
                className={`fade-up fade-up-${Math.min(i + 1, 5)}`}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '28px 24px',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)')
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')
                }
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{s.emoji}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    marginBottom: 10,
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
                  {s.description}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {s.details.map(d => (
                    <li key={d} style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', gap: 8 }}>
                      <span>–</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              textAlign: 'center',
              padding: '48px 20px',
              background: 'var(--accent-soft)',
              borderRadius: 20,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                marginBottom: 12,
              }}
            >
              Ready to start?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 24 }}>
              Tell me what you need — I&apos;ll give you a straight answer on timeline and cost.
            </p>
            <Link
              href="/contact"
              style={{
                textDecoration: 'none',
                background: 'var(--text)',
                color: 'var(--bg)',
                padding: '13px 28px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Get a quote
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
