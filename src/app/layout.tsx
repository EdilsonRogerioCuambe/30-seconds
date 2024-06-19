import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from './components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quick Talk Game',
  description:
    'Tente fazer com que seu colega de equipe adivinhe a palavra ou frase na carta sem dizer a palavra ou frase.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.className} bg-[#202024] text-[#f5f5f5]`}>
        {children}
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
