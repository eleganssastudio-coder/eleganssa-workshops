// Client-side pixel events
export function pixelTrack(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event, params)
  }
}

// Server-side Conversions API
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN

export async function capiTrack(
  eventName: string,
  eventData: {
    value?: number
    currency?: string
    contentIds?: string[]
    contentName?: string
    contentType?: string
    numItems?: number
    clientIpAddress?: string
    clientUserAgent?: string
    fbp?: string
    fbc?: string
  }
) {
  if (!PIXEL_ID || !ACCESS_TOKEN) return

  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              user_data: {
                client_ip_address: eventData.clientIpAddress,
                client_user_agent: eventData.clientUserAgent,
                fbp: eventData.fbp,
                fbc: eventData.fbc,
              },
              custom_data: {
                value: eventData.value,
                currency: eventData.currency || 'EUR',
                content_ids: eventData.contentIds,
                content_name: eventData.contentName,
                content_type: eventData.contentType || 'product',
                num_items: eventData.numItems,
              },
            },
          ],
        }),
      }
    )
  } catch (_) {}
}
