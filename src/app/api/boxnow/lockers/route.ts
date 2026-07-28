import { NextResponse } from 'next/server'
import { getLockers } from '@/lib/boxnow'

export const revalidate = 3600

export async function GET() {
  try {
    const lockers = await getLockers()
    return NextResponse.json(lockers)
  } catch (e) {
    console.error('BoxNow lockers error:', e)
    return NextResponse.json([], { status: 200 })
  }
}
