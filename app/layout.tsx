import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// 1. AuthProvider'ı context dosyasından import et
// (Dosya adının AuthContext.jsx veya AuthContext.tsx olduğunu varsayıyoruz)
import { AuthProvider } from "@/context/AuthContext";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Metadata'yı CRM projenize göre güncelleyebilirsiniz
export const metadata: Metadata = {
  title: "CRM App", // Güncellendi
  description: "CRM Projesi Arayüzü", // Güncellendi
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {/* 2. AuthProvider'ı buraya ekle.
             Bu bileşen "use client;" ile başladığı için, 
             uygulamanın geri kalanı için context (durum) sağlar.
        */}

        <AuthProvider>
          {children} {/* children artık AuthProvider'ın içinde */}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
