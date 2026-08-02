import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    return NextResponse.json({
      orderNumber: session.metadata?.orderNumber,
      metadata: session.metadata,
      amountTotal: session.amount_total,
      customerEmail: session.customer_email,
    })
  } catch (error) {
    console.error('Stripe verify error:', error)
    return NextResponse.json({ error: 'Грешка при верификация' }, { status: 500 })
  }
}
