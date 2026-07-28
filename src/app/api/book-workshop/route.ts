import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { writeClient } from '@/sanity/writeClient'
import { capiTrack } from '@/lib/metaEvents'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { workshopId, workshopTitle, sessionIndex, sessionInfo, spots, price, name, email, phone, paymentMethod } = body

  const bookingId = `WS-${Date.now().toString().slice(-6)}`
  const deposit = 20
  const total = price * spots

  if (paymentMethod === 'card') {
    // Create Stripe Checkout session for 20€ deposit
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'eur',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Капаро — ${workshopTitle}`,
              description: `${sessionInfo} · ${spots} участник${spots > 1 ? 'а' : ''} · Остатък ${total - deposit}€ се заплаща на място`,
            },
            unit_amount: deposit * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { bookingId, workshopId, sessionIndex: String(sessionIndex), spots: String(spots), name, phone, workshopTitle, sessionInfo, total: String(total) },
      success_url: `${req.headers.get('origin')}/rabotilnitsi/uspeh?booking=${bookingId}&session=${encodeURIComponent(sessionInfo)}&workshop=${encodeURIComponent(workshopTitle)}&spots=${spots}&total=${total}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
      cancel_url: `${req.headers.get('origin')}/rabotilnitsi`,
    })
    return NextResponse.json({ url: session.url })
  }

  // Bank transfer — decrease spots immediately and send email
  await decreaseSpots(workshopId, sessionIndex, spots)
  await sendEmail({ bookingId, workshopTitle, sessionInfo, spots, total, deposit, name, email, phone, paymentMethod: 'bank' })

  return NextResponse.json({ bookingId })
}

export async function GET(req: NextRequest) {
  // Called from success page after Stripe payment
  const { searchParams } = new URL(req.url)
  const workshopId = searchParams.get('workshopId')
  const sessionIndex = searchParams.get('sessionIndex')
  const spots = searchParams.get('spots')
  const bookingId = searchParams.get('bookingId')
  const workshopTitle = searchParams.get('workshopTitle') || ''
  const sessionInfo = searchParams.get('sessionInfo') || ''
  const total = searchParams.get('total') || '0'
  const name = searchParams.get('name') || ''
  const email = searchParams.get('email') || ''
  const phone = searchParams.get('phone') || ''

  if (workshopId && sessionIndex !== null && spots) {
    await decreaseSpots(workshopId, Number(sessionIndex), Number(spots))
    await sendEmail({ bookingId: bookingId || '', workshopTitle, sessionInfo, spots: Number(spots), total: Number(total), deposit: 20, name, email, phone, paymentMethod: 'card' })
    await capiTrack('Purchase', {
      value: 20,
      currency: 'EUR',
      contentName: workshopTitle,
      contentType: 'product',
      numItems: Number(spots),
      clientIpAddress: req.headers.get('x-forwarded-for') || undefined,
      clientUserAgent: req.headers.get('user-agent') || undefined,
    })
  }

  return NextResponse.json({ ok: true })
}

async function decreaseSpots(workshopId: string, sessionIndex: number, spots: number) {
  try {
    const workshop = await writeClient.getDocument(workshopId) as any
    if (!workshop?.sessions?.[sessionIndex]) return
    const current = workshop.sessions[sessionIndex].spotsLeft ?? 0
    const newSpots = Math.max(0, current - spots)
    await writeClient
      .patch(workshopId)
      .set({ [`sessions[${sessionIndex}].spotsLeft`]: newSpots })
      .commit()
  } catch (e) {
    console.error('Failed to decrease spots:', e)
  }
}

async function sendEmail(data: {
  bookingId: string; workshopTitle: string; sessionInfo: string
  spots: number; total: number; deposit: number
  name: string; email: string; phone: string; paymentMethod: string
}) {
  try {
    // Email to owner
    await fetch('https://formspree.io/f/mpqgnbbd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `Ново записване за работилница — ${data.bookingId}`,
        'Номер на записването': data.bookingId,
        'Работилница': data.workshopTitle,
        'Дата и час': data.sessionInfo,
        'Брой участници': data.spots,
        'Обща сума': `${data.total} €`,
        'Платено капаро': `${data.deposit} € (${data.paymentMethod === 'card' ? 'карта' : 'банков превод'})`,
        'Остатък за на място': `${data.total - data.deposit} €`,
        'Имена': data.name,
        'Имейл': data.email,
        'Телефон': data.phone,
      }),
    })

    // Email to client for bank transfer
    if (data.paymentMethod === 'bank') {
      await fetch('https://formspree.io/f/mpqgnbbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _replyto: 'eleganssastudio@gmail.com',
          _subject: `Потвърждение за записване — ${data.workshopTitle}`,
          'До': data.email,
          'Здравейте': data.name,
          'Записване №': data.bookingId,
          'Работилница': data.workshopTitle,
          'Дата и час': data.sessionInfo,
          'Брой участници': data.spots,
          'Капаро за превод': `${data.deposit} €`,
          'Получател': 'ELEGANSA EOOD',
          'IBAN': 'BG17INTF40012092397597',
          'Банка': 'iCard AD',
          'BIC': 'INTFBGSF',
          'Основание': `Капаро ${data.bookingId}`,
          'Важно': `Моля преведете капарото от ${data.deposit} € в рамките на 24 часа. При неплащане записването се анулира автоматично и мястото се освобождава.`,
          'Остатък': `${data.total - data.deposit} € се заплаща на място в деня на работилницата.`,
          'Въпроси': 'eleganssastudio@gmail.com | @eleganssastudio',
        }),
      })
    }
  } catch (e) {
    console.error('Formspree error:', e)
  }
}
