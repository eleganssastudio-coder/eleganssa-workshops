import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { productBySlugQuery, productsQuery } from '@/sanity/queries'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product = null
  let allProducts: any[] = []

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      product = await client.fetch(productBySlugQuery, { slug: params.slug })
      allProducts = await client.fetch(productsQuery) || []
    }
  } catch (e) {
    // fallback below
  }

  if (!product) {
    notFound()
  }

  const related = allProducts
    .filter((p: any) => (p._id || p.id) !== (product._id || product.id))
    .slice(0, 4)

  return <ProductDetailClient product={product} relatedProducts={related} />
}
