import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Focus Quest - Gamified Deep Work Hub",
    template: "%s | Focus Quest",
  },
  description: "Level up your productivity in 8-bit style. Gamified Pomodoro timer, immersive scenes, and deep work tracking.",
  keywords: ["productivity", "pomodoro", "deep work", "gamification", "focus timer", "rpg productivity"],
  authors: [{ name: "Focus Quest Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://focus-quest.vercel.app", // ปรับเป็น URL จริงของคุณเมื่อ deploy
    siteName: "Focus Quest",
    title: "Focus Quest - Level Up Your Productivity",
    description: "Gamified Pomodoro timer with immersive 8-bit environments.",
    images: [
      {
        url: "/og-image.png", // ควรมีรูปใน public
        width: 1200,
        height: 630,
        alt: "Focus Quest Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Quest - Gamified Deep Work Hub",
    description: "Level up your productivity in 8-bit style.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
