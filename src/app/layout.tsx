import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ParticleCanvas from "@/components/ParticleCanvas";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "TEDx ICEAS 2026 | Threads of Change",
  description:
    "TEDxICEAS is an independently organized TED event at Impact College of Engineering and Applied Sciences, Bengaluru. Join us for 2026 under the theme 'Threads of Change'.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
        <body className="bg-black text-[#f0f0f0] antialiased overflow-x-hidden">
          <ParticleCanvas />
          <div className="relative z-10">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
