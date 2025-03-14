import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Page Fault Simmulator',
  description: 'Created by konsept',
  generator: 'ranjansharma.info.np',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
