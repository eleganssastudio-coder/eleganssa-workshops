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

  // Normalize to ensure required fields always exist
  const normalized = {
    ...product,
    id: product._id || product.id || product.slug,
    images: Array.isArray(product.images) ? product.images.filter((img: any) => typeof img === 'string') : [],
    variants: Array.isArray(product.variants)
      ? product.variants.map((v: any) => ({
          ...v,
          type: v.type || '',
          options: Array.isArray(v.options)
            ? v.options.map((o: any) =>
                typeof o === 'string' ? { value: o, price: null, image: null } : { value: o.value || '', price: o.price ?? null, image: o.image ?? null }
              )
            : [],
        }))
      : [],
    category: product.category || { name: '', slug: '' },
  }

  const related = allProducts
    .filter((p: any) => (p._id || p.id) !== (product._id || product.id))
    .slice(0, 4)
    .map((p: any) => ({
      ...p,
      id: p._id || p.id || p.slug,
      images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
      category: p.category || { name: '', slug: '' },
    }))

  return <ProductDetailClient product={normalized} relatedProducts={related} />
}
