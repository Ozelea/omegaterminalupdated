import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { APP_FULL_TITLE, APP_DESCRIPTION } from "@/lib/constants";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { WalletProvider } from "@/providers/WalletProvider";
import { MultiChainProvider } from "@/providers/MultiChainProvider";
import { SpotifyProvider } from "@/providers/SpotifyProvider";
import { YouTubeProvider } from "@/providers/YouTubeProvider";
import { NewsReaderProvider } from "@/providers/NewsReaderProvider";

/**
 * Metadata configuration for the application
 */
export const metadata: Metadata = {
  title: APP_FULL_TITLE,
  description: APP_DESCRIPTION,
  keywords: [
    "web3",
    "terminal",
    "blockchain",
    "crypto",
    "chaingpt",
    "ai",
    "nft",
    "smart-contracts",
    "omega",
    "multi-chain",
  ],
  authors: [{ name: "Omega Terminal Team" }],
  robots: "index, follow",
  openGraph: {
    title: APP_FULL_TITLE,
    description: APP_DESCRIPTION,
    type: "website",
  },
};

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * Root layout component for the application
 * This is a Server Component that wraps all pages
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Cache Control */}
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Preload fonts */}
        <link
          rel="preload"
          href="/fonts/CourierNew.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* External SDK Scripts */}
        <Script
          src="https://sdk.scdn.co/spotify-player.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ThemeProvider>
          <WalletProvider>
            <MultiChainProvider>
              <SpotifyProvider>
                <YouTubeProvider>
                  <NewsReaderProvider>{children}</NewsReaderProvider>
                </YouTubeProvider>
              </SpotifyProvider>
            </MultiChainProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
