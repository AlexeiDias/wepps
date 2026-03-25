import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'wepps — Custom web apps, built fast',
  description:
    'Full-stack web apps built with Next.js, Firebase, and Claude AI. From idea to live product.',
  openGraph: {
    title: 'wepps',
    description: 'Custom web apps, built fast.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
