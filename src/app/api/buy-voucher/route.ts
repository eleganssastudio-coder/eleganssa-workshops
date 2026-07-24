import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { writeClient } from '@/sanity/writeClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'ELEG-'
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

const WORKSHOP_PRICE = 39

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { voucherType, value, deliveryMethod, boxnowAddress, senderName, senderEmail, recipientName, recipientEmail, message } = body

  const code = generateCode()
  const origin = req.headers.get('origin')

  const unitAmount = voucherType === 'workshop' ? WORKSHOP_PRICE * 100 : (value ?? 0) * 100
  const resolvedValue = voucherType === 'workshop' ? WORKSHOP_PRICE : (value ?? 0)

  const deliveryLabel = deliveryMethod === 'digital' ? 'Дигитален — по имейл'
    : deliveryMethod === 'atelier' ? 'Физическа картичка — от ателието'
    : `Физическа картичка — BoxNow: ${boxnowAddress || ''}`

  const productName = voucherType === 'workshop'
    ? 'Подаръчен ваучер за работилница — Eleganssa Studio'
    : `Подаръчен ваучер ${resolvedValue} € — Eleganssa Studio`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'eur',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: productName,
            description: `${deliveryLabel}${recipientName ? ` · За: ${recipientName}` : ''}`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    customer_email: senderEmail,
    metadata: {
      code,
      voucherType,
      value: String(resolvedValue),
      deliveryMethod: deliveryMethod || 'digital',
      boxnowAddress: boxnowAddress || '',
      senderName,
      senderEmail,
      recipientName,
      recipientEmail,
      message: message || '',
    },
    success_url: `${origin}/vaucheri/uspeh?code=${code}&type=${voucherType}&value=${resolvedValue}&recipientName=${encodeURIComponent(recipientName)}&recipientEmail=${encodeURIComponent(recipientEmail)}&senderEmail=${encodeURIComponent(senderEmail)}&delivery=${deliveryMethod}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/vaucheri`,
  })

  return NextResponse.json({ url: session.url })
}

export async function GET(req: NextRequest) {
  // Called from success page after Stripe payment — save to Sanity + send emails
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const sessionId = searchParams.get('session_id')

  if (!code || !sessionId) return NextResponse.json({ ok: false })

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
    if (stripeSession.payment_status !== 'paid') return NextResponse.json({ ok: false })

    const meta = stripeSession.metadata || {}

    // Save voucher to Sanity
    await writeClient.create({
      _type: 'voucher',
      code,
      type: meta.voucherType,
      value: meta.value ? Number(meta.value) : undefined,
      senderName: meta.senderName,
      senderEmail: meta.senderEmail,
      recipientName: meta.recipientName,
      recipientEmail: meta.recipientEmail,
      message: meta.message,
      used: false,
      paidAt: new Date().toISOString(),
    })

    const deliveryLabel = meta.deliveryMethod === 'digital' ? 'Дигитален — по имейл'
      : meta.deliveryMethod === 'atelier' ? 'Физическа картичка — от ателието'
      : `Физическа картичка — BoxNow: ${meta.boxnowAddress}`

    // Email to owner (Formspree)
    await fetch('https://formspree.io/f/mpqgnbbd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `Нов подаръчен ваучер — ${code}`,
        'Код на ваучера': code,
        'Тип': meta.voucherType === 'workshop' ? 'За работилница' : `На стойност ${meta.value} €`,
        'Формат': deliveryLabel,
        'Подател': `${meta.senderName} (${meta.senderEmail})`,
        'Получател': `${meta.recipientName} (${meta.recipientEmail})`,
        'Послание': meta.message || '—',
        'Платено': `${stripeSession.amount_total ? stripeSession.amount_total / 100 : '?'} €`,
      }),
    })

    // Email to recipient with voucher code
    await fetch('https://formspree.io/f/mpqgnbbd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _replyto: meta.senderEmail,
        _subject: `Подаръчен ваучер от ${meta.senderName} — Eleganssa Studio`,
        'До': meta.recipientEmail,
        'Съобщение': meta.message ? `"${meta.message}"` : undefined,
        'Вашият ваучер код': code,
        'Тип': meta.voucherType === 'workshop' ? 'Работилница по избор' : `${meta.value} € за покупки в магазина`,
        'Как да го използвате': 'Въведете кода при плащане на работилница или поръчка от магазина.',
      }),
    })
  } catch (e) {
    console.error('Voucher save error:', e)
  }

  return NextResponse.json({ ok: true })
}
