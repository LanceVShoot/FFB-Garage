import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/hooks/useAuth';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'FFB Garage',
  description: 'iRacing Force Feedback Settings Database',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
                   bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-zinc-100
                   min-h-screen selection:bg-zinc-700/50`}
      >
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <AuthProvider>
          {children}
          <SpeedInsights />
          <Analytics />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgb(9, 9, 11)',
                border: '1px solid rgb(39, 39, 42)',
                color: 'rgb(244, 244, 245)',
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
