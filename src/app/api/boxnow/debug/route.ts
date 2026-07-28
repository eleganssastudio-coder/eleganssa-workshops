import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.BOXNOW_CLIENT_ID
  const clientSecret = process.env.BOXNOW_CLIENT_SECRET
  const apiUrl = process.env.BOXNOW_API_URL

  // Test the auth endpoint directly and return raw response
  let authResult: any = null
  try {
    const res = await fetch(`${apiUrl || 'https://api-production.boxnow.bg'}/v1/authentication`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strategy: 'client-credentials',
        clientId,
        clientSecret,
      }),
    })
    const text = await res.text()
    authResult = { status: res.status, body: text }
  } catch (e) {
    authResult = { error: String(e) }
  }

  return NextResponse.json({
    clientIdSet: !!clientId,
    clientIdPrefix: clientId?.slice(0, 8),
    clientSecretSet: !!clientSecret,
    clientSecretPrefix: clientSecret?.slice(0, 8),
    apiUrl,
    authResult,
  })
}
