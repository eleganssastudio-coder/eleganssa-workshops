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
    shortDescription,
    ingredients,
    variants[] {
      type,
      options[] { value, price, "image": image.asset->url }
    },
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
    "description": select(defined(description) => pt::text(description), shortDescription),
    shortDescription,
    ingredients,
    variants[] {
      type,
      options[] { value, price, "image": image.asset->url }
    },
    category-> { name, "slug": slug.current }
  }
`

export const workshopsQuery = groq`
  *[_type == "workshop" && active == true] | order(_createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
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
    shortDescription,
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
    heroLabel,
    heroOverlayOpacity,
    heroTextColor,
    heroCta1Label,
    heroCta1Link,
    heroCta2Label,
    heroCta2Link,
    "heroImage": heroImage.asset->url,
    pillars,
    workshopCtaTitle,
    workshopCtaLabel,
    workshopCtaText,
    workshopCtaBullets,
    workshopCtaBtnLabel,
    workshopCtaOverlay,
    "workshopCtaImage": workshopCtaImage.asset->url,
    newsletterTitle,
    newsletterText
  }
`

export const aboutQuery = groq`
  *[_type == "about"][0] {
    heroTitle,
    heroSubtitle,
    heroLabel,
    heroOverlayOpacity,
    "heroImage": heroImage.asset->url,
    storyLabel,
    storyTitle,
    "storyBody": pt::text(storyBody),
    "mainImage": mainImage.asset->url,
    "secondaryImage": secondaryImage.asset->url,
    valuesLabel,
    valuesTitle,
    values,
    instagramTitle,
    instagramText,
    instagramHandle,
    instagramUrl
  }
`
