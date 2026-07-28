import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.BOXNOW_CLIENT_ID
  const clientSecret = process.env.BOXNOW_CLIENT_SECRET
  const apiUrl = process.env.BOXNOW_API_URL

  const base = apiUrl || 'https://api-production.boxnow.bg'
  const results: any = {}

  // Test the correct auth endpoint from BoxNow docs
  try {
    const res = await fetch(`${base}/api/v1/auth-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
    })
    const text = await res.text()
    results['POST /api/v1/auth-sessions'] = { status: res.status, body: text.slice(0, 500) }
  } catch (e) {
    results['POST /api/v1/auth-sessions'] = { error: String(e) }
  }
  const authResult = results

  return NextResponse.json({
    clientIdSet: !!clientId,
    clientIdPrefix: clientId?.slice(0, 8),
    clientSecretSet: !!clientSecret,
    clientSecretPrefix: clientSecret?.slice(0, 8),
    apiUrl,
    authResult,
  })
}
