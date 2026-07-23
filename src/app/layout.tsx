import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import CookieBanner from '@/components/layout/CookieBanner'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Eleganssa Studio | Ръчно изработени соеви свещи и Jesmonite изделия',
    template: '%s | Eleganssa Studio',
  },
  description:
    'Eleganssa Studio - ателие за ръчно изработени соеви свещи и Jesmonite изделия във Варна. Открийте нашите работилници и уникални продукти. Твори. Миксирай. Създай.',
  keywords: [
    'соеви свещи',
    'Jesmonite',
    'ръчно изработени',
    'Варна',
    'работилници',
    'подаръци',
    'eleganssa studio',
  ],
  authors: [{ name: 'Eleganssa Studio' }],
  creator: 'Eleganssa Studio',
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://eleganssastudio.com',
    siteName: 'Eleganssa Studio',
    title: 'Eleganssa Studio | Ръчно изработени соеви свещи и Jesmonite изделия',
    description:
      'Ателие за ръчно изработени соеви свещи и Jesmonite изделия във Варна. Работилници и онлайн магазин.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=1200',
        width: 1200,
        height: 630,
        alt: 'Eleganssa Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eleganssa Studio',
    description: 'Ръчно изработени соеви свещи и Jesmonite изделия от Варна',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <CookieBanner />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#2D3D4F',
              color: '#F5EDE3',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '0',
            },
          }}
        />
      </body>
    </html>
  )
}
