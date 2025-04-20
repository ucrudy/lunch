import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from '@/components/AppContext';
import "./globals.css";

import {Providers} from "./providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lunch Nearby",
  description: "Find lunch nearby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AppProvider initialValue={{ lunch: [], location: null, isModalOpen: false, loading: false, distance: 0, priceRange: null, page: null, isFilterDrawerOpen: false, isScrolling: false }}>
              {children}
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
