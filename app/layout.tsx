import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Font to JSON/JS Converter",
  description: "Convert font files to JSON/JS using opentype.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
