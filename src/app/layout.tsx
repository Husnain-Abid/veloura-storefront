import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { StoreProvider } from "@/store/StoreProvider";
import { AppInit } from "@/components/providers/AppInit";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ELEGANCE | Premium Women's Fashion Pakistan",
  description: "Shop the latest Western Wear and Luxury Intimates for women. Premium quality, elegant styles, and fast delivery in Pakistan.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white text-black antialiased font-sans">
        <StoreProvider>
          <AppInit>
            <AnnouncementBar />
            <Header />
            <main className="min-h-screen pt-[100px]">
              {children}
            </main>
            <Footer />
          </AppInit>
        </StoreProvider>
      </body>
    </html>
  );
}
