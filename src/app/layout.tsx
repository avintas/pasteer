import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PASTEER - Content Processing Tool",
  description: "Process and clean your text content with PASTEER. Remove HTML tags, URLs, emails, and normalize text formatting.",
  keywords: ["content processing", "text cleaning", "HTML removal", "text normalization"],
  authors: [{ name: "PASTEER Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "PASTEER - Content Processing Tool",
    description: "Process and clean your text content with PASTEER",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PASTEER - Content Processing Tool",
    description: "Process and clean your text content with PASTEER",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
