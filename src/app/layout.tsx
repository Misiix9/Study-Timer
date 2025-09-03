import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Study Timer - Focus & Productivity Tracker",
  description: "A powerful Pomodoro study timer with analytics, subject management, and goal tracking to boost your productivity.",
  keywords: ["pomodoro", "study timer", "productivity", "focus", "time tracking", "analytics"],
  authors: [{ name: "Study Timer" }],
  creator: "Study Timer",
  metadataBase: new URL("https://study-timer.app"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Study Timer",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://study-timer.app",
    title: "Study Timer - Focus & Productivity Tracker",
    description: "A powerful Pomodoro study timer with analytics, subject management, and goal tracking to boost your productivity.",
    siteName: "Study Timer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Study Timer - Focus & Productivity Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Timer - Focus & Productivity Tracker",
    description: "A powerful Pomodoro study timer with analytics, subject management, and goal tracking to boost your productivity.",
    images: ["/og-image.png"],
    creator: "@studytimer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Study Timer" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#3b82f6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}