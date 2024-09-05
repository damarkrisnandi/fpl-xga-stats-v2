import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/main/AppHeader";
import AppFooter from "@/components/main/AppFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FantasyXGA",
  description: "Generated by create next app",
  icons: {
    icon: [
      {
        url: '/xga_icon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/xga_icon.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHeader />
        {children}
        <AppFooter /> 
        </body>
    </html>
  );
}
