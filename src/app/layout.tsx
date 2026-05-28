import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'NutriLens — AI Calorie Tracker',
  description:
    'Snap a photo of any meal and instantly get calorie counts, macronutrient breakdowns, and personalized dietary insights powered by AI.',
  keywords: ['calorie tracker', 'nutrition', 'AI', 'food analysis', 'meal tracker', 'diet'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NutriLens',
  },
  openGraph: {
    title: 'NutriLens — AI Calorie Tracker',
    description: 'Point. Snap. Know. AI-powered nutrition tracking.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3a8c6a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        <meta name="theme-color" content="#3a8c6a" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        <ServiceWorkerRegister />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
