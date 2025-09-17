import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
});

// --- MODIFICARE AICI ---
export const metadata: Metadata = {
  title: "Quantum - AI Project Management",
  description: "Organizează-ți proiectele la viteza viitorului.",
  icons: {
    icon: '/faviconlogo.png', // Calea către imaginea din folderul /public
  },
};
// --- SFÂRȘIT MODIFICARE ---

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={inter.variable}>
      <body>
        <CustomCursor />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}