import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'SAP Nihongo Community | JLPT Mock Exam',
  description:
    'JLPT mock examination platform for team upskilling. Practice N5 and N4 level Japanese language proficiency tests.',
  keywords: ['JLPT', 'Japanese', 'mock exam', 'N5', 'N4', 'language test'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Link
          href="/admin"
          className="fixed top-4 right-4 z-50 bg-[#1B2A4A] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:opacity-90"
        >
          Admin
        </Link>
        {children}
      </body>
    </html>
  );
}
