import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google"; // Added Hind_Siliguri
import AllProvider from "../providers/AllProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  title: {
    default: "সিদ্দীকিয়া প্রকাশনী",
    template: "%s | সিদ্দীকিয়া প্রকাশনী",
  },
  description: "সিদ্দীকিয়া প্রকাশনী",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${hindSiliguri.variable}`}>
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
