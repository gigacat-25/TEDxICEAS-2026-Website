import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEDx ICEAS 2026 | What Shapes Us",
  description:
    "TEDxICEAS is an independently organized TED event at Impact College of Engineering and Applied Sciences, Bengaluru. Join us for 2026 under the theme 'What Shapes Us'.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="bg-[#0d0d0d] text-[#f0f0f0] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
