import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "AUI Carpool | rides for the AUI community",
    template: "%s · AUI Carpool",
  },
  description:
    "Share rides between Ifrane and the rest of Morocco with verified members of the AUI community. Cheaper than a grand taxi, safer than riding with strangers.",
  keywords: [
    "AUI",
    "Al Akhawayn",
    "carpool",
    "covoiturage",
    "Ifrane",
    "rideshare",
    "Morocco",
  ],
  openGraph: {
    title: "AUI Carpool",
    description:
      "Share rides between Ifrane and the rest of Morocco with verified members of the AUI community.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col pb-20 md:pb-0">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
