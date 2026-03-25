'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  const links = [
    { href: '/', label: 'Work' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(250,250,248,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 20px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                color: 'var(--text)',
                letterSpacing: '-0.02em',
              }}
            >
              wepps
            </span>
          </Link>

          {/* Desktop links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}
            className="hidden-mobile"
          >
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 400,
                  color: path === l.href ? 'var(--text)' : 'var(--text-2)',
                  borderBottom: path === l.href ? '1px solid var(--text)' : '1px solid transparent',
                  paddingBottom: 2,
                  transition: 'color 0.2s',
                }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              style={{
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                background: 'var(--text)',
                color: 'var(--bg)',
                padding: '8px 18px',
                borderRadius: 8,
                transition: 'opacity 0.2s',
              }}
            >
              Hire me
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: 'var(--text)',
            }}
            className="show-mobile"
            aria-label="Menu"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 36,
                color: path === l.href ? 'var(--text)' : 'var(--text-2)',
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            style={{
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 500,
              background: 'var(--text)',
              color: 'var(--bg)',
              padding: '12px 28px',
              borderRadius: 10,
            }}
          >
            Hire me
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
