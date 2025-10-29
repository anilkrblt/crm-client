import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
// 1. AuthProvider import'unu SİL
// import { AuthProvider } from "@/context/AuthContext";

// 2. Yeni 'Providers' bileşenini İMPORT ET
import Providers from "./providers"; // (Eğer dosyayı 'src/app/' içine oluşturduysan)

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM App",
  description: "CRM Projesi Arayüzü",
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
        {/* 3. AuthProvider yerine <Providers> kullan */}
        <Providers>
          {children} {/* children artık Providers'ın içinde */}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}