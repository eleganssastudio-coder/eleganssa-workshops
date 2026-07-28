import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from '@/sanity/client'
import { productBySlugQuery, productsQuery } from '@/sanity/queries'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      const product = await client.fetch(productBySlugQuery, { slug: params.slug })
      if (product) {
        return {
          title: product.name,
          description: product.shortDescription || `${product.name} — ръчно изработено от Eleganssa Studio. ${product.price ? `Цена: ${product.price}€.` : ''}`,
          openGraph: {
            title: product.name,
            description: product.shortDescription || '',
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
          },
        }
      }
    }
  } catch (_) {}
  return {}
}

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: normalized.name,
    description: normalized.shortDescription || '',
    image: normalized.images[0] || undefined,
    brand: { '@type': 'Brand', name: 'Eleganssa Studio' },
    offers: {
      '@type': 'Offer',
      price: normalized.price,
      priceCurrency: 'EUR',
      availability: normalized.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://eleganssastudio.com/magazin/${params.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={normalized} relatedProducts={related} />
    </>
  )
}
