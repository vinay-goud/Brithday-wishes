import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SparkleTrail from "@/components/SparkleTrail";
import ShakeConfetti from "@/components/ShakeConfetti";
import DoubleTapHeart from "@/components/DoubleTapHeart";
import BalloonRelease from "@/components/BalloonRelease";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open for a Surprise",
  description: "Click to see your birthday surprise!",
  keywords: ["Happy Birthday", "Birthday Template", "Next.js", "Three.js", "React Three Fiber", "GSAP", "Interactive Web", "Open Source"],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎁</text></svg>',
  },
  openGraph: {
    title: "Open for a Surprise",
    description: "Click to see your birthday surprise!",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Birthday Surprise",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open for a Surprise",
    description: "Click to see your birthday surprise!",
    images: ["/thumbnail.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFC0CB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${playfair.variable} antialiased text-foreground selection:bg-pink-300 selection:text-pink-900 overscroll-none overflow-x-hidden`}
      >
        <SmoothScroll>
          <SparkleTrail />
          <ShakeConfetti />
          <DoubleTapHeart />
          <BalloonRelease />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
