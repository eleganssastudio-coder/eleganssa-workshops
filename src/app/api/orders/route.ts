import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod } = body

    if (!items || !customerEmail || !shippingAddress) {
      return NextResponse.json({ error: 'Липсват задължителни полета' }, { status: 400 })
    }

    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 100 ? 0 : 7
    const total = subtotal + shipping

    // In production: prisma.order.create({ data: { ... } })
    const orderNumber = `ES-${Date.now().toString().slice(-6)}`

    return NextResponse.json({
      success: true,
      orderNumber,
      total,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при обработка на поръчката' }, { status: 500 })
  }
}
