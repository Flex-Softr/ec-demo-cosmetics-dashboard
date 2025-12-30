import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AllProvider from "../providers/AllProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Nora Life Style",
    template: "%s | Nora Life Style",
  },
  description: "Nora Life Style",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AllProvider>
          <main className="max-w-[1920px] mx-auto relative text-gray-900">
            {children}
            <Toaster />
          </main>
        </AllProvider>
      </body>
    </html>
  );
}
