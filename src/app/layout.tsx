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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='tr'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
