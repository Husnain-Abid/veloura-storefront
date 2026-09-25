import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </div>
  );
}
