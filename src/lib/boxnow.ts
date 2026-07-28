const API_URL = process.env.BOXNOW_API_URL || 'https://api-production.boxnow.bg'
const CLIENT_ID = process.env.BOXNOW_CLIENT_ID
const CLIENT_SECRET = process.env.BOXNOW_CLIENT_SECRET
const PARTNER_ID = process.env.BOXNOW_PARTNER_ID ? Number(process.env.BOXNOW_PARTNER_ID) : 15925
const WAREHOUSE_ID = process.env.BOXNOW_WAREHOUSE_ID ? Number(process.env.BOXNOW_WAREHOUSE_ID) : 2

let tokenCache: { token: string; expires: number } | null = null

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expires) return tokenCache.token

  const res = await fetch(`${API_URL}/v1/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  })

  const data = await res.json()
  tokenCache = {
    token: data.access_token,
    expires: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000,
  }
  return data.access_token
}

export interface BoxNowLocker {
  id: string
  name: string
  address: string
  city: string
  postCode?: string
  lat?: number
  lng?: number
}

export async function getLockers(): Promise<BoxNowLocker[]> {
  const token = await getToken()
  const res = await fetch(`${API_URL}/v1/delivery-points`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  })
  const data = await res.json()
  // Normalize response — BoxNow returns array under data or directly
  const items: any[] = Array.isArray(data) ? data : (data.data ?? data.items ?? [])
  return items.map((l: any) => ({
    id: String(l.id ?? l.delivery_point_id ?? l.lockerId),
    name: l.name ?? l.title ?? '',
    address: l.address ?? l.street ?? '',
    city: l.city ?? l.town ?? '',
    postCode: l.post_code ?? l.postCode ?? '',
    lat: l.lat ?? l.latitude,
    lng: l.lng ?? l.longitude,
  }))
}

export async function createParcel(params: {
  recipientName: string
  recipientPhone: string
  recipientEmail?: string
  lockerId: string
  description: string
  codAmount?: number
  weight?: number
}): Promise<{ id?: string; trackingNumber?: string; error?: string }> {
  try {
    const token = await getToken()
    const res = await fetch(`${API_URL}/v1/parcels`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        partner_id: PARTNER_ID,
        warehouse_id: WAREHOUSE_ID,
        recipient: {
          name: params.recipientName,
          phone: params.recipientPhone,
          email: params.recipientEmail,
        },
        delivery_point_id: params.lockerId,
        description: params.description,
        cod_amount: params.codAmount ?? 0,
        weight: params.weight ?? 1,
      }),
    })
    const data = await res.json()
    return {
      id: String(data.id ?? data.parcel_id ?? ''),
      trackingNumber: data.tracking_number ?? data.barcode ?? '',
    }
  } catch (e) {
    console.error('BoxNow createParcel error:', e)
    return { error: String(e) }
  }
}
