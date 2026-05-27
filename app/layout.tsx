import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from 'next-themes'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://victormssalves.com'
const AUTHOR   = 'Victor Manoel Soares Silva Alves'
const HANDLE   = '@victormssalves'

/* ─────────────────────────────────────────────────────────────
   Metadata
───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:  'Victor Alves — Frontend Developer',
    template: '%s | Victor Alves',
  },

  description:
    'Frontend Developer especializado em interfaces premium, acessíveis e orientadas ao produto. React, TypeScript, Next.js, da ideia ao deploy.',

  keywords: [
    'Frontend Developer',
    'React',
    'TypeScript',
    'Next.js',
    'Tailwind CSS',
    'UI/UX',
    'Acessibilidade',
    'Salvador Bahia',
    'Victor Alves',
  ],

  authors:  [{ name: AUTHOR, url: SITE_URL }],
  creator:  AUTHOR,
  publisher: AUTHOR,

  /* Open Graph */
  openGraph: {
    type:        'website',
    url:         SITE_URL,
    siteName:    'Victor Alves',
    title:       'Victor Alves — Frontend Developer',
    description: 'Frontend Developer especializado em interfaces premium, acessíveis e orientadas ao produto.',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'Victor Alves — Frontend Developer',
      },
    ],
    locale: 'pt_BR',
  },

  /* Twitter / X */
  twitter: {
    card:        'summary_large_image',
    title:       'Victor Alves — Frontend Developer',
    description: 'Frontend Developer especializado em interfaces premium, acessíveis e orientadas ao produto.',
    images:      ['/og-image.png'],
    creator:     HANDLE,
  },

  /* Robots */
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  /* Canonical */
  alternates: {
    canonical: SITE_URL,
    languages: {
      'pt-BR': SITE_URL,
    },
  },

  /* Icons */
  icons: {
    icon:  [
      { url: '/favicon.ico',                    sizes: 'any'   },
      { url: '/icon.svg',     type: 'image/svg+xml'            },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
  },

  /* Manifest */
  manifest: '/site.webmanifest',

  /* Category */
  category: 'technology',
}

/* ─────────────────────────────────────────────────────────────
   Viewport (separado de metadata — Next.js 14+)
───────────────────────────────────────────────────────────── */

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0d0e10' },
    { media: '(prefers-color-scheme: light)', color: '#f5f5f8' },
  ],
  width:        'device-width',
  initialScale: 1,
  // Não forçamos maximumScale para respeitar zoom de acessibilidade
}

/* ─────────────────────────────────────────────────────────────
   Root layout
───────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      /**
       * `data-mode` é controlado pelo RecruiterModeProvider via useEffect —
       * o atributo aqui garante que o CSS base [data-mode] não quebre no SSR.
       */
    >
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {/* ── Skip-to-content — acessibilidade / teclado ─── */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            fixed top-4 left-4 z-[9999]
            px-4 py-2 rounded-md text-sm font-medium
            bg-[var(--color-accent-500)] text-white
            focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-300)]
            transition-all
          "
        >
          Ir para o conteúdo principal
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}