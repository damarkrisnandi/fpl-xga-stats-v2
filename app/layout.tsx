import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/main/AppHeader";
import AppFooter from "@/components/main/AppFooter";
import AppSideBar from "@/components/main/AppSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FantasyXGA",
  description: "Generated by create next app",
  icons: {
    icon: [
      {
        url: "/xga_icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/xga_icon.png",
        media: "(prefers-color-scheme: dark)",
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
      <body>
        <AppHeader />
        <div className="flex w-full">
          <div className="hidden md:block w-3/12 lg:w-2/12 bg-slate-200 fixed top-0 h-screen">
            <AppSideBar />
          </div>
          <div className="w-full">{children}</div>
        </div>
        <AppFooter />
      </body>
    </html>
  );
}
