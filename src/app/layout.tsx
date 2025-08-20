import './globals.css';
import { RootBloombergCanvas } from '@/components/ui/RootBloombergCanvas';
import { HoverController } from '@/components/ui/HoverController';

export const metadata = { title: 'Portfolio' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <HoverController />
        <RootBloombergCanvas />
        {children}
      </body>
    </html>
  );
}
