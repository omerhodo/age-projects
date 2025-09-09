import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reklamları Devre Dışı Bırak | Opt Out of Ads',
  description:
    'Kişiselleştirilmiş reklamları devre dışı bırakın | Disable personalized advertisements',
  robots: 'noindex, nofollow',
};

export default function OptOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
