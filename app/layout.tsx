import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "burnote — share secrets that disappear",
  description:
    "Zero-knowledge secret sharing. Encrypted in your browser. The server never sees your content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} font-mono antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
