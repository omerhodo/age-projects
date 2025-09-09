import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.scss';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Yaş Hesaplama Uygulaması | Age Calculator Application',
  description:
    'Doğum tarihinizi girerek mevcut yaşınızı hesaplayın | Calculate your current age by entering your birth date',
  keywords: [
    'yaş hesaplama',
    'age calculator',
    'doğum tarihi',
    'birth date',
    'yaş',
    'age',
    'hesaplama',
    'calculator',
  ],
  authors: [{ name: 'Ömer Hodo' }],
  openGraph: {
    title: 'Yaş Hesaplama Uygulaması | Age Calculator Application',
    description: 'Doğum tarihinizi girerek mevcut yaşınızı hesaplayın',
    type: 'website',
    locale: 'tr_TR',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='tr'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no, minimal-ui'
        />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='msapplication-tap-highlight' content='no' />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
