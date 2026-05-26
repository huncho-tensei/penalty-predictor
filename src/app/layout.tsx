import type { Metadata } from "next";
import { Barlow_Condensed, Noto_Sans } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Penalty Shootout Predictor | FIFA World Cup 2026",
  description:
    "Predict penalty outcomes between any two players from the 2026 FIFA World Cup. Research-backed probability model with animated simulations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-noto">
        {children}
      </body>
    </html>
  );
}
