import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.BOXNOW_CLIENT_ID
  const clientSecret = process.env.BOXNOW_CLIENT_SECRET
  const apiUrl = process.env.BOXNOW_API_URL

  const base = apiUrl || 'https://api-production.boxnow.bg'
  const results: any = {}

  // Try multiple auth strategies
  const attempts = [
    { url: `${base}/authentication`, body: { strategy: 'local', clientId, clientSecret } },
    { url: `${base}/authentication`, body: { strategy: 'local', email: clientId, password: clientSecret } },
    { url: `${base}/authentication`, body: { strategy: 'api-key', clientId, clientSecret } },
    { url: `${base}/v1/authentication`, body: { strategy: 'local', clientId, clientSecret } },
  ]

  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt.body),
      })
      const text = await res.text()
      const key = `${attempt.url} [${(attempt.body as any).strategy}]`
      results[key] = { status: res.status, body: text.slice(0, 200) }
    } catch (e) {
      results[attempt.url] = { error: String(e) }
    }
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
