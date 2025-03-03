import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
  title: "SRT Subtitle Editor",
  description: "A modern web application for editing and synchronizing SRT subtitle files with video content",
  manifest: "/manifest.json",
  icons: {
    icon: "/subtitle-icon.svg"
  },
  openGraph: {
    type: "website",
    title: "SRT Subtitle Editor",
    description: "A modern web application for editing and synchronizing SRT subtitle files with video content",
    images: [{
      url: "/srt-suntitle-editor.jpg",
      width: 1200,
      height: 630,
      alt: "SRT Subtitle Editor Preview"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "SRT Subtitle Editor",
    description: "A modern web application for editing and synchronizing SRT subtitle files with video content",
    images: ["/srt-suntitle-editor.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
