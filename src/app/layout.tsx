import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LegalDisclaimer } from "@/components/DataDisclaimer";
import { AdminUnlock } from "@/components/AdminUnlock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://franchisel.com"),
  title: {
    default: "Franchisel — Independent Franchise Due Diligence Intelligence",
    template: "%s | Franchisel",
  },
  description:
    "The definitive independent source of franchise investment intelligence. FDD analysis, verified community data, and red flag identification — aligned with the buyer, never the franchisor.",
  alternates: {
    canonical: "https://franchisel.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Franchisel",
    url: "https://franchisel.com",
    title: "Franchisel — Independent Franchise Due Diligence Intelligence",
    description:
      "Plain-English FDD analysis, verified franchisee data, and red flag identification. Before you invest $50K–$2M, get the truth.",
    images: [
      {
        url: "https://franchisel.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Franchisel — Independent Franchise Due Diligence Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Franchisel",
    creator: "@Franchisel",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AdminUnlock />
        <Header />
        <main className="flex-1">{children}</main>
        <LegalDisclaimer />
        <Footer />
      </body>
    </html>
  );
}
