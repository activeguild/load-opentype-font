import type { Metadata, Viewport } from "next";
import "./globals.css";

// metadataBaseを設定（本番環境のURLに変更してください）
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://load-opentype-font.vercel.app/';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Font to JSON/JS Converter | 無料フォント変換ツール",
  description: "フォントファイル（TTF, OTF, WOFF）をJSON/JavaScript形式に変換する無料オンラインツール。opentype.jsを使用してブラウザ上で安全に変換できます。",
  keywords: ["font converter", "フォント変換", "TTF to JSON", "OTF to JSON", "WOFF to JSON", "opentype.js", "フォント", "変換ツール"],
  authors: [{ name: "Font Converter" }],
  creator: "Font Converter",
  publisher: "Font Converter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "Font to JSON/JS Converter | 無料フォント変換ツール",
    description: "フォントファイル（TTF, OTF, WOFF）をJSON/JavaScript形式に変換する無料オンラインツール。",
    siteName: "Font Converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Font to JSON/JS Converter | 無料フォント変換ツール",
    description: "フォントファイル（TTF, OTF, WOFF）をJSON/JavaScript形式に変換する無料オンラインツール。",
  },
  verification: {
    // Google Search Consoleの検証コードをここに追加できます
    // google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Font to JSON/JS Converter',
    description: 'フォントファイル（TTF, OTF, WOFF）をJSON/JavaScript形式に変換する無料オンラインツール',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    featureList: [
      'TTFフォント変換',
      'OTFフォント変換',
      'WOFFフォント変換',
      'JSON出力',
      'JavaScript出力',
      'ブラウザ上で完結',
    ],
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
