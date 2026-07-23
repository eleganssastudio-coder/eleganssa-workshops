import { groq } from 'next-sanity'

export const productsQuery = groq`
  *[_type == "product"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    price,
    comparePrice,
    "images": images[].asset->url,
    inStock,
    featured,
    "shortDescription": pt::text(shortDescription),
    "ingredients": pt::text(ingredients),
    variants,
    category-> { name, "slug": slug.current }
  }
`

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(order asc)[0...8] {
    _id,
    name,
    "slug": slug.current,
    price,
    comparePrice,
    "images": images[].asset->url,
    inStock,
    featured,
    category-> { name, "slug": slug.current }
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    price,
    comparePrice,
    "images": images[].asset->url,
    inStock,
    featured,
    "description": pt::text(description),
    "shortDescription": pt::text(shortDescription),
    "ingredients": pt::text(ingredients),
    variants,
    category-> { name, "slug": slug.current }
  }
`

export const workshopsQuery = groq`
  *[_type == "workshop" && active == true] | order(_createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    "shortDescription": pt::text(shortDescription),
    "image": image.asset->url,
    price,
    duration,
    maxSpots,
    includes,
    steps,
    sessions
  }
`

export const workshopBySlugQuery = groq`
  *[_type == "workshop" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "shortDescription": pt::text(shortDescription),
    "description": pt::text(description),
    "image": image.asset->url,
    price,
    duration,
    maxSpots,
    includes,
    steps,
    sessions
  }
`

export const featuredReviewsQuery = groq`
  *[_type == "review" && featured == true] | order(_createdAt desc)[0...6] {
    _id,
    author,
    rating,
    title,
    body,
    date
  }
`

export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    heroTitle,
    heroSubtitle,
    "heroImage": heroImage.asset->url
  }
`
