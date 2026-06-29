import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SellMemo - Le mémo intelligent des vendeurs',
  description: 'Plateforme SaaS pour gérer vos commandes facilement via WhatsApp, Facebook et Instagram',
  keywords: 'vendeur, commandes, mémorisation, SaaS, WhatsApp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
