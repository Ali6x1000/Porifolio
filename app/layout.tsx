import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ThemeProvider } from '../components/theme-provider'

import ChatBot from './components/ChatBot'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CS Portfolio - Ali Nawaf',
  description: 'Computer Science Portfolio showcasing projects, blog posts, and professional experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          <ChatBot />
          <Footer />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
