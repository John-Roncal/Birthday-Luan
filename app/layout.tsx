import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Cumpleaños de Luan",
  description: "¡Celebra el primer cumpleaños de Luan! Invitación digital con temática del mundo marino.",
  keywords: ["cumpleaños", "Luan", "primer año", "invitación", "mundo marino"],
  authors: [{ name: "Familia de Luan" }],
  openGraph: {
    title: "Cumpleaños de Luan 🎂 - 1 Año",
    description: "¡Celebra el primer cumpleaños de Luan! Invitación digital con temática del mundo marino.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* Theme color para mobile */}
        <meta name="theme-color" content="#57B6E5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}