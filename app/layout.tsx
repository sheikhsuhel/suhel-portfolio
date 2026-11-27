import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Activity } from "./activity";

const productionUrl = "https://suhel-portfolio-blue.vercel.app";
const openGraphImageUrl = `${productionUrl}/og.png`;

const title = "Sheikh Suhel Ahmed | Data & Business Analytics";
const description = "Explore Sheikh Suhel Ahmed’s Excel study of 99,441 Olist orders and SQL analysis of product sales across 10 territories. Seeking a Data Analyst internship.";

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title,
  description,
  alternates: {
    canonical: productionUrl,
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: productionUrl,
    images: [{ url: openGraphImageUrl, width: 1731, height: 909, alt: "Sheikh Suhel Ahmed portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [openGraphImageUrl],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#07111f" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>{children}<Activity /></body>
    </html>
  );
}
