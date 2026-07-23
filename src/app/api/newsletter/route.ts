import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Невалиден имейл адрес' }, { status: 400 })
    }

    // In production:
    // await prisma.newsletter.upsert({ where: { email }, update: {}, create: { email } })
    // await resend.emails.send({ from: 'Eleganssa Studio <hello@eleganssastudio.com>', to: email, subject: 'Добре дошли!', ... })

    return NextResponse.json({ success: true, message: 'Успешно се абонирахте за нашия бюлетин!' })
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при абониране' }, { status: 500 })
  }
}
