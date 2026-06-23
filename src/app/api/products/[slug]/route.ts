import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // In production this would be: prisma.product.findUnique({ where: { slug: params.slug }, include: { category: true, variants: true, reviews: { include: { user: true } } } })
  return NextResponse.json({ message: 'Product endpoint - connect to Prisma', slug: params.slug })
}
