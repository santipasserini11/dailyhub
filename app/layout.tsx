import type { Metadata, Viewport } from "next";
import { Comfortaa, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DailyHub - Humand",
  description: "Tu hub de empleado para el día a día en Humand",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#182E7B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${comfortaa.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
