import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/writeClient'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ valid: false })

  try {
    const voucher = await writeClient.fetch(
      `*[_type == "voucher" && code == $code && used != true][0]`,
      { code }
    )
    if (!voucher) return NextResponse.json({ valid: false })
    return NextResponse.json({ valid: true, type: voucher.type, value: voucher.value, _id: voucher._id })
  } catch {
    return NextResponse.json({ valid: false })
  }
}

export async function POST(req: NextRequest) {
  // Mark voucher as used
  const { code } = await req.json()
  if (!code) return NextResponse.json({ ok: false })

  try {
    const voucher = await writeClient.fetch(
      `*[_type == "voucher" && code == $code && used != true][0]`,
      { code }
    )
    if (!voucher) return NextResponse.json({ ok: false })
    await writeClient.patch(voucher._id).set({ used: true }).commit()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
