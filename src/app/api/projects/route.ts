import { NextRequest, NextResponse } from 'next/server'

function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token')
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    // Actual save handled client-side via Firebase SDK in admin panel
    // This endpoint is for server-side operations if needed later
    return NextResponse.json({ ok: true, data: body })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
