import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "One Million Volunteers | NYSC Sri Lanka",
  description: "Register as a volunteer for the Five-Day Relief Camp organized by National Youth Services Council (NYSC) to help disaster survivors in Sri Lanka.",
  keywords: ["volunteer", "Sri Lanka", "NYSC", "relief camp", "disaster relief", "volunteers registration"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
