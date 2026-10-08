import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Caveat, Kaushan_Script } from 'next/font/google';
import { CLASS_INFO } from '@/data/site';
import './globals.css';

const bricolage = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin'] });
const caveat = Caveat({ variable: '--font-caveat', subsets: ['latin'], weight: ['500', '700'] });
const kaushan = Kaushan_Script({ variable: '--font-kaushan', subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: `${CLASS_INFO.name} — ${CLASS_INFO.semester}`,
  description: 'Ten groups, five phases, one wall of ideas: the Design Thinking Class C portfolio.',
  // The page lists students' names and NRPs, so keep it out of search results by default.
  // Flip to index: true only if the class agrees to be findable.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#e9e6df',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${caveat.variable} ${kaushan.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
