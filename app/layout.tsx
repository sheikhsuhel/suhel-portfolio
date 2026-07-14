import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.includes(":") ? "http" : "https");
  const baseUrl = host ? `${protocol}://${host}` : undefined;

  return {
    ...(baseUrl ? { metadataBase: new URL(baseUrl) } : {}),
    title: "Sheikh Suhel Ahmed | Aspiring Data Analyst",
    description: "The verification-first portfolio of Sheikh Suhel Ahmed, a BBA student at North South University and aspiring Data Analyst and Business Analyst.",
    openGraph: {
      title: "Sheikh Suhel Ahmed",
      description: "Aspiring Data Analyst & BBA Student",
      type: "website",
      images: [{ url: "/og.png", width: 1732, height: 909, alt: "Sheikh Suhel Ahmed portfolio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sheikh Suhel Ahmed",
      description: "Aspiring Data Analyst & BBA Student",
      images: ["/og.png"],
    },
  };
}

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
