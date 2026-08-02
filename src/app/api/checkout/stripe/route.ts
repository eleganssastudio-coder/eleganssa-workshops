import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const {
      items,
      shippingCost,
      deliveryType,
      boxnowLocker,
      speedyLocation,
      speedyAddress,
      shippingData,
      orderNumber,
      voucherDiscount,
      successUrl,
      cancelUrl,
    } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Количката е празна' }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.variant ? `${item.name} (${item.variant})` : item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    if (shippingCost > 0) {
      const shippingLabel =
        deliveryType === 'speedy-address' ? 'Доставка Спиди до адрес' : 'Доставка Спиди до офис/автомат'
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: shippingLabel },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = []
    if (voucherDiscount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(voucherDiscount * 100),
        currency: 'eur',
        duration: 'once',
        name: 'Ваучер отстъпка',
      })
      discounts.push({ coupon: coupon.id })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: shippingData.email,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      ...(discounts.length > 0 ? { discounts } : {}),
      metadata: {
        orderNumber,
        deliveryType,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        phone: shippingData.phone,
        email: shippingData.email,
        boxnowLockerId: boxnowLocker?.id || '',
        boxnowLockerName: boxnowLocker?.name || '',
        boxnowLockerAddress: boxnowLocker?.address || '',
        boxnowLockerCity: boxnowLocker?.city || '',
        speedyLocation: speedyLocation || '',
        speedyAddress: speedyAddress || '',
        voucherDiscount: String(voucherDiscount || 0),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Грешка при създаване на Stripe сесия' }, { status: 500 })
  }
}
