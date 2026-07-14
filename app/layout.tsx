import type { Metadata, Viewport } from "next";
import "./globals.css";

const productionUrl = "https://suhel-portfolio-blue.vercel.app";
const openGraphImageUrl = `${productionUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: "Sheikh Suhel Ahmed | Aspiring Data Analyst",
  description: "The verification-first portfolio of Sheikh Suhel Ahmed, a BBA student at North South University and aspiring Data Analyst and Business Analyst.",
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
    images: [{ url: openGraphImageUrl, width: 1732, height: 909, alt: "Sheikh Suhel Ahmed portfolio" }],
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
      <body>{children}</body>
    </html>
  );
}
