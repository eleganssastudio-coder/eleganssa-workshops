import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.BOXNOW_CLIENT_ID
  const clientSecret = process.env.BOXNOW_CLIENT_SECRET
  const apiUrl = process.env.BOXNOW_API_URL

  const base = apiUrl || 'https://api-production.boxnow.bg'
  const results: any = {}

  // Check swagger/docs
  for (const path of ['/docs', '/swagger', '/api-docs', '/swagger.json', '/v1/swagger.json']) {
    try {
      const res = await fetch(`${base}${path}`)
      results[`GET ${path}`] = { status: res.status }
    } catch (e) {
      results[`GET ${path}`] = { error: String(e) }
    }
  }

  // Try more auth formats
  const attempts = [
    { label: 'POST /authentication [partner]', url: `${base}/authentication`, body: { strategy: 'partner', clientId, clientSecret } },
    { label: 'POST /authentication [email+pass]', url: `${base}/authentication`, body: { strategy: 'local', email: clientId, password: clientSecret } },
    { label: 'POST /v1/oauth/token [body creds]', url: `${base}/v1/oauth/token`, body: { grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret } },
    { label: 'POST /oauth/token [body creds]', url: `${base}/oauth/token`, body: { grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret } },
  ]

  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt.body),
      })
      const text = await res.text()
      results[attempt.label] = { status: res.status, body: text.slice(0, 300) }
    } catch (e) {
      results[attempt.label] = { error: String(e) }
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
