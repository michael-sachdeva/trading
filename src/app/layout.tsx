import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "TradeMaster AI Academy — Master Indian & Global Trading",
    template: "%s | TradeMaster AI Academy",
  },
  description:
    "Learn Indian & US stock markets, Forex, Commodities, Options and more with AI-powered, bilingual (Hindi/English) courses. Start for ₹999.",
  openGraph: {
    title: "TradeMaster AI Academy",
    description: "AI-powered trading education in Hindi & English.",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
