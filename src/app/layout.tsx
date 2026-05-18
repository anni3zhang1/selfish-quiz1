import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, DM_Serif_Display, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import Nav from "./Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stance — Know Where You Stand",
  description:
    "Take a quiz on any topic. Discover where you stand and the thinkers who shape your worldview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${dmSerifDisplay.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <Nav />
        <div className="pt-12 flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
