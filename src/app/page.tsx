import Navbar from '@/components/Navbar'
import ProjectCard from '@/components/ProjectCard'
import { getProjects, Project } from '@/lib/firebase'
import Link from 'next/link'

export const revalidate = 60 // ISR — refresh every 60 seconds

export default async function HomePage() {
  let projects: Project[] = []
  try {
    const all = await getProjects()
    projects = all.filter(p => p.status === 'live')
  } catch {
    // Firebase not configured yet — show empty state
  }

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 56 }}>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '64px 20px 48px',
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
            Full-stack app builder
          </p>
          <h1
            className="fade-up fade-up-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 8vw, 72px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              marginBottom: 24,
              maxWidth: 700,
            }}
          >
            Custom web apps,
            <br />
            <em>built fast.</em>
          </h1>
          <p
            className="fade-up fade-up-3"
            style={{
              fontSize: 16,
              color: 'var(--text-2)',
              maxWidth: 480,
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            From idea to live product — Next.js, Firebase, and Claude AI. Real apps that work, shipped in weeks.
          </p>
          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
                transition: 'opacity 0.2s',
              }}
            >
              Start a project
            </Link>
            <Link
              href="/services"
              style={{
                textDecoration: 'none',
                border: '1px solid var(--border-strong)',
                color: 'var(--text)',
                padding: '12px 24px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 400,
                transition: 'border-color 0.2s',
              }}
            >
              See services
            </Link>
          </div>
        </section>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid var(--border)', maxWidth: 1100, margin: '0 auto 0' }} />

        {/* ── Portfolio grid ───────────────────────────────────── */}
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '48px 20px 80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              Recent work
            </h2>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
              {projects.length} app{projects.length !== 1 ? 's' : ''} live
            </span>
          </div>

          {projects.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-3)',
                border: '1px dashed var(--border)',
                borderRadius: 16,
              }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>
                Coming soon
              </p>
              <p style={{ fontSize: 14 }}>Projects will appear here once added from the admin dashboard.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 24,
              }}
            >
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA strip ────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--text)',
            color: 'var(--bg)',
            padding: '56px 20px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            Have an app idea?
          </p>
          <p style={{ fontSize: 15, opacity: 0.65, marginBottom: 28 }}>
            Let&apos;s build it. No fluff, just results.
          </p>
          <Link
            href="/contact"
            style={{
              textDecoration: 'none',
              background: 'var(--bg)',
              color: 'var(--text)',
              padding: '13px 28px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Get in touch →
          </Link>
        </section>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid var(--border)',
            padding: '24px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: 1100,
            margin: '0 auto',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)' }}>
            wepps
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            © {new Date().getFullYear()} · Built with Next.js &amp; Claude AI
          </span>
        </footer>
      </main>
    </>
  )
}
