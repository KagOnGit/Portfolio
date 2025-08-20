import './globals.css';
import FxProvider from '@/providers/FxProvider';
import { Analytics } from "@vercel/analytics/react";
import SmoothScroll from "@/components/fx/SmoothScroll";
import RootBloombergCanvas from "@/components/fx/RootBloombergCanvas";

export const metadata = {
  title: 'Aditya Singh — Portfolio',
  description: 'Professional portfolio showcasing tech × finance expertise',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' data-fx='on'>
      <head>
        {/* Bootstrap: read saved state; if invalid/missing -> 'on' */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var key = 'fx:state';
                  var saved = localStorage.getItem(key);
                  var val = (saved === 'on' || saved === 'off') ? saved : 'on';
                  if (val !== saved) localStorage.setItem(key, val);
                  document.documentElement.setAttribute('data-fx', val);
                } catch (e) {
                  document.documentElement.setAttribute('data-fx', 'on');
                }
              })();
            `
          }}
        />
      </head>
      <body>
        <FxProvider>
          <RootBloombergCanvas />
          <SmoothScroll />
          {children}
          <Analytics />
        </FxProvider>
      </body>
    </html>
  );
}
