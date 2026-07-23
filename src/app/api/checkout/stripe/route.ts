import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { items, customerEmail, successUrl, cancelUrl } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Количката е празна' }, { status: 400 })
    }

    // In production with Stripe configured:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: items.map((item) => ({
    //     price_data: {
    //       currency: 'eur',
    //       product_data: { name: item.name, images: [item.image] },
    //       unit_amount: Math.round(item.price * 100),
    //     },
    //     quantity: item.quantity,
    //   })),
    //   mode: 'payment',
    //   customer_email: customerEmail,
    //   success_url: successUrl,
    //   cancel_url: cancelUrl,
    // })
    // return NextResponse.json({ url: session.url })

    return NextResponse.json({
      url: successUrl || '/',
      message: 'Stripe не е конфигуриран. Добавете STRIPE_SECRET_KEY в .env',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при създаване на Stripe сесия' }, { status: 500 })
  }
}
