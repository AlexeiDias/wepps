'use client'

import Image from 'next/image'
import { Project } from '@/lib/firebase'

interface Props {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: Props) {
  return (
    <article
      className={`fade-up fade-up-${Math.min(index + 1, 5)}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Screenshot */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: 'var(--accent-soft)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {project.screenshotUrl ? (
          <Image
            src={project.screenshotUrl}
            alt={project.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-3)',
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: '-0.01em',
            }}
          >
            {project.name}
          </div>
        )}

        {/* Status badge */}
        <span
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontSize: 11,
            fontWeight: 500,
            padding: '3px 10px',
            borderRadius: 99,
            background: project.status === 'live' ? 'var(--live-bg)' : 'var(--draft-bg)',
            color: project.status === 'live' ? 'var(--live-text)' : 'var(--draft-text)',
          }}
        >
          {project.status === 'live' ? '● Live' : '○ Draft'}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            marginBottom: 6,
            color: 'var(--text)',
          }}
        >
          {project.name}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-2)',
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          {project.description}
        </p>

        {project.liveUrl && project.status === 'live' && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--border-strong)',
              paddingBottom: 1,
              transition: 'border-color 0.15s',
            }}
          >
            View live app
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
    </article>
  )
}
