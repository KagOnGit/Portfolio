import './globals.css';
import RootBloombergCanvas from '@/components/fx/RootBloombergCanvas';
import { Analytics } from "@vercel/analytics/react";
import SmoothScroll from "@/components/fx/SmoothScroll";

export const metadata = { title: 'Portfolio' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <RootBloombergCanvas />
        <SmoothScroll />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
