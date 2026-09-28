import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'http://localhost:3000'),
  title: 'Cổ Học Viện — Bản đồ tri thức thực chứng',
  description: 'Khám phá 12 công nghệ và hệ thống tri thức cổ đại qua nguyên lý, bằng chứng và di sản còn lại.',
  icons: { icon: '/favicon.png' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    title: 'Cổ Học Viện — Bản đồ tri thức thực chứng',
    description: '12 công nghệ đã dựng nên thế giới, được phân tích qua nguyên lý, bằng chứng và giới hạn.',
    images: [{
      url: '/og.png',
      width: 1731,
      height: 909,
      alt: 'Cổ Học Viện — 12 công nghệ đã dựng nên thế giới',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cổ Học Viện — Bản đồ tri thức thực chứng',
    description: '12 công nghệ đã dựng nên thế giới, được phân tích qua nguyên lý, bằng chứng và giới hạn.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
