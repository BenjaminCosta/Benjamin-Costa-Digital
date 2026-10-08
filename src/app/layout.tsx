import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight, Poppins } from "next/font/google";
import type { ReactNode } from "react";
import { env } from "@/lib/env";
import "./globals.css";

// Latin only: the copy (including á, é, í) sits in the basic subset, and each
// extra subset is another font file preloaded on every visit.
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Workana's own typeface, used only inside the Workana reviews block.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

const siteName = "Benjamin Costa";
const siteTitle = "Benjamin Costa — Websites & automation, Gold Coast";
const siteDescription =
  "Websites, booking systems and automations for local businesses on the Gold Coast.";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F2F0EA",
  colorScheme: "light",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${interTight.variable} ${plexMono.variable} ${poppins.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
