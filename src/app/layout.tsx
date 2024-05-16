import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '30 Segungos',
  description: '30 Segundos é um jogo de tabuleiro de perguntas e respostas.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
