import type { Metadata } from "next"
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}