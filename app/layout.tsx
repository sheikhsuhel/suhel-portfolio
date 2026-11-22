import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Activity } from "./activity";

const productionUrl = "https://suhel-portfolio-blue.vercel.app";
const openGraphImageUrl = `${productionUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: "Sheikh Suhel Ahmed | Data & Business Portfolio",
  description: "Explore Sheikh Suhel Ahmed’s Excel analysis of 99,441 Olist orders, SQL product queries, business education and analytics credentials.",
  alternates: {
    canonical: productionUrl,
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Sheikh Suhel Ahmed",
    description: "Aspiring Data Analyst & BBA Student",
    type: "website",
    url: productionUrl,
    images: [{ url: openGraphImageUrl, width: 1731, height: 909, alt: "Sheikh Suhel Ahmed portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheikh Suhel Ahmed",
    description: "Aspiring Data Analyst & BBA Student",
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
