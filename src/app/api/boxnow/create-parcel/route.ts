import { NextRequest, NextResponse } from 'next/server'
import { createParcel } from '@/lib/boxnow'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await createParcel(body)
  return NextResponse.json(result)
}
