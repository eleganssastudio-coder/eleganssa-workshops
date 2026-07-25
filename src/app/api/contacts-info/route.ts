import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { contactsPageQuery } from '@/sanity/queries'

export async function GET() {
  try {
    const data = await client.fetch(contactsPageQuery)
    return NextResponse.json(data || {})
  } catch {
    return NextResponse.json({})
  }
}
