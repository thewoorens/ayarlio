import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { isMobileUserAgent } from "@/lib/device";
import { DeviceProvider } from "./providers/device-provider";
import { headers } from "next/headers";
import { HeroProvider } from "./providers/hero-provider";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Ayarlio - BETA",
    template: "%s | Ayarlio",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userAgent = (await headers()).get("user-agent") || "";
  const initialMobile = isMobileUserAgent(userAgent);

  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <HeroProvider>
          <DeviceProvider initialMobile={initialMobile}>
            <ToastProvider>
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
              </div>
            </ToastProvider>
          </DeviceProvider>
        </HeroProvider>
      </body>
    </html>
  );
}
