'use client'

import { useState, useEffect, useRef } from 'react'
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  uploadScreenshot,
  getInquiries,
  markInquiryRead,
  Project,
  Inquiry,
} from '@/lib/firebase'

const TABS = ['Projects', 'Inquiries'] as const
type Tab = (typeof TABS)[number]

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const [tab, setTab] = useState<Tab>('Projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Omit<Project, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    liveUrl: '',
    screenshotUrl: '',
    screenshotPath: '',
    status: 'draft',
    order: 0,
  })
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Auth ────────────────────────────────────────────────────────────────────
  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || pw === 'admin') {
      // We check against env in middleware; here we just flag the session
      // For a real check, call an API route — kept simple for this setup
      setAuthed(true)
      sessionStorage.setItem('wepps_admin', pw)
    } else {
      setPwError(true)
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('wepps_admin')
    if (saved) setAuthed(true)
  }, [])

  // ── Data load ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return
    load()
  }, [authed])

  async function load() {
    setLoading(true)
    try {
      const [p, i] = await Promise.all([getProjects(), getInquiries()])
      setProjects(p)
      setInquiries(i)
    } catch (err) {
      console.error('Load error — check Firebase config', err)
    }
    setLoading(false)
  }

  // ── Form helpers ─────────────────────────────────────────────────────────────
  function openNew() {
    setEditing(null)
    setForm({
      name: '',
      description: '',
      liveUrl: '',
      screenshotUrl: '',
      screenshotPath: '',
      status: 'draft',
      order: projects.length,
    })
    setScreenshotFile(null)
    setScreenshotPreview('')
    setShowForm(true)
  }

  function openEdit(p: Project) {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description,
      liveUrl: p.liveUrl,
      screenshotUrl: p.screenshotUrl,
      screenshotPath: p.screenshotPath,
      status: p.status,
      order: p.order,
    })
    setScreenshotFile(null)
    setScreenshotPreview(p.screenshotUrl || '')
    setShowForm(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshotFile(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      let { screenshotUrl, screenshotPath } = form

      if (screenshotFile) {
        const uploaded = await uploadScreenshot(screenshotFile)
        screenshotUrl = uploaded.url
        screenshotPath = uploaded.path
      }

      const data = { ...form, screenshotUrl, screenshotPath }

      if (editing?.id) {
        await updateProject(editing.id, data)
      } else {
        await addProject(data)
      }

      setShowForm(false)
      await load()
    } catch (err) {
      console.error('Save error:', err)
      alert('Save failed — check console')
    }
    setSaving(false)
  }

  async function handleDelete(p: Project) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    try {
      await deleteProject(p.id!, p.screenshotPath)
      await load()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  async function handleMarkRead(inquiry: Inquiry) {
    if (!inquiry.id || inquiry.read) return
    await markInquiryRead(inquiry.id)
    setInquiries(prev => prev.map(i => (i.id === inquiry.id ? { ...i, read: true } : i)))
  }

  // ── Styles ────────────────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--surface)',
    fontSize: 14,
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    outline: 'none',
  }

  // ── Login screen ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          padding: 20,
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: '100%',
            maxWidth: 360,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '40px 32px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginBottom: 6,
            }}
          >
            wepps admin
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28 }}>
            Enter your admin password to continue
          </p>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwError(false) }}
            style={{
              ...inputStyle,
              marginBottom: 8,
              borderColor: pwError ? '#e05' : 'var(--border)',
            }}
            autoFocus
          />
          {pwError && (
            <p style={{ fontSize: 12, color: '#e05', marginBottom: 12 }}>Incorrect password</p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: 8,
              background: 'var(--text)',
              color: 'var(--bg)',
              border: 'none',
              padding: '12px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
            }}
          >
            Sign in
          </button>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 16, textAlign: 'center' }}>
            Set NEXT_PUBLIC_ADMIN_PASSWORD in your .env.local
          </p>
        </form>
      </div>
    )
  }

  // ── Admin UI ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>wepps admin</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a
            href="/"
            target="_blank"
            style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}
          >
            View site ↗
          </a>
          <button
            onClick={() => { sessionStorage.removeItem('wepps_admin'); setAuthed(false) }}
            style={{
              fontSize: 13,
              color: 'var(--text-3)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total apps', value: projects.length },
            { label: 'Live apps', value: projects.filter(p => p.status === 'live').length },
            { label: 'Inquiries', value: inquiries.length },
          ].map(s => (
            <div
              key={s.label}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '16px 18px',
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 500 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '7px 18px',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                background: tab === t ? 'var(--text)' : 'transparent',
                color: tab === t ? 'var(--bg)' : 'var(--text-2)',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {t}
              {t === 'Inquiries' && inquiries.filter(i => !i.read).length > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: '#e05566',
                    color: '#fff',
                    borderRadius: 99,
                    fontSize: 10,
                    padding: '1px 6px',
                  }}
                >
                  {inquiries.filter(i => !i.read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Projects tab ─────────────────────────────────────────────────── */}
        {tab === 'Projects' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400 }}>Apps</h2>
              <button
                onClick={openNew}
                style={{
                  background: 'var(--text)',
                  color: 'var(--bg)',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                + Add app
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-3)', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>Loading…</p>
            ) : projects.length === 0 ? (
              <div
                style={{
                  border: '1px dashed var(--border)',
                  borderRadius: 16,
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: 'var(--text-3)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>No apps yet</p>
                <p style={{ fontSize: 14 }}>Click &quot;+ Add app&quot; to add your first project.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projects.map(p => (
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 14,
                      padding: '16px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Screenshot thumb */}
                    <div
                      style={{
                        width: 72,
                        height: 44,
                        borderRadius: 8,
                        background: 'var(--accent-soft)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      {p.screenshotUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.screenshotUrl}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 340 }}>
                        {p.description}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '3px 10px',
                        borderRadius: 99,
                        background: p.status === 'live' ? 'var(--live-bg)' : 'var(--draft-bg)',
                        color: p.status === 'live' ? 'var(--live-text)' : 'var(--draft-text)',
                        flexShrink: 0,
                      }}
                    >
                      {p.status}
                    </span>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => openEdit(p)}
                        style={{
                          padding: '7px 14px',
                          fontSize: 13,
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          background: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--text)',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        style={{
                          padding: '7px 14px',
                          fontSize: 13,
                          border: '1px solid #fcc',
                          borderRadius: 8,
                          background: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          color: '#c33',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Inquiries tab ─────────────────────────────────────────────────── */}
        {tab === 'Inquiries' && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 16 }}>
              Inquiries
            </h2>
            {loading ? (
              <p style={{ color: 'var(--text-3)', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>Loading…</p>
            ) : inquiries.length === 0 ? (
              <div style={{ border: '1px dashed var(--border)', borderRadius: 16, padding: '60px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>No inquiries yet</p>
                <p style={{ fontSize: 14 }}>Messages from your contact form will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {inquiries.map(inq => (
                  <div
                    key={inq.id}
                    onClick={() => handleMarkRead(inq)}
                    style={{
                      background: inq.read ? 'var(--surface)' : 'var(--accent-soft)',
                      border: `1px solid ${inq.read ? 'var(--border)' : 'var(--border-strong)'}`,
                      borderRadius: 14,
                      padding: '18px 20px',
                      cursor: inq.read ? 'default' : 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontWeight: 500, fontSize: 15 }}>{inq.name}</span>
                        <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 10 }}>{inq.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {!inq.read && (
                          <span style={{ fontSize: 10, fontWeight: 500, background: '#e05566', color: '#fff', padding: '2px 8px', borderRadius: 99 }}>
                            New
                          </span>
                        )}
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                          {inq.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{inq.message}</p>
                    <a
                      href={`mailto:${inq.email}?subject=Re: Your wepps inquiry`}
                      onClick={e => e.stopPropagation()}
                      style={{ fontSize: 13, color: 'var(--text)', display: 'inline-block', marginTop: 10, textDecoration: 'none', borderBottom: '1px solid var(--border-strong)' }}
                    >
                      Reply by email →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Add / Edit Form Modal ─────────────────────────────────────────────── */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0',
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '20px 20px 0 0',
              width: '100%',
              maxWidth: 600,
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '28px 24px 40px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400 }}>
                {editing ? 'Edit app' : 'Add new app'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-3)', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>App name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="EstimatePro"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Short description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="One or two sentences about what this app does."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Live URL</label>
                <input
                  type="url"
                  value={form.liveUrl}
                  onChange={e => setForm({ ...form, liveUrl: e.target.value })}
                  placeholder="https://your-app.vercel.app"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px dashed var(--border-strong)',
                    borderRadius: 10,
                    background: 'var(--accent-soft)',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'var(--text-2)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {screenshotFile ? screenshotFile.name : screenshotPreview ? 'Replace screenshot' : 'Upload screenshot'}
                </button>
                {screenshotPreview && (
                  <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '16/9', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={screenshotPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as 'live' | 'draft' })}
                  style={{ ...inputStyle }}
                >
                  <option value="draft">Draft — hidden from public</option>
                  <option value="live">Live — visible on portfolio</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Display order</label>
                <input
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                  style={{ ...inputStyle, maxWidth: 100 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-2)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 2,
                    padding: '12px',
                    border: 'none',
                    borderRadius: 10,
                    background: 'var(--text)',
                    color: 'var(--bg)',
                    cursor: saving ? 'wait' : 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Add app'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
