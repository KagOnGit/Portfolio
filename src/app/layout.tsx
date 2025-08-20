import './globals.css';
import RootBloombergCanvas from '@/components/fx/RootBloombergCanvas';

export const metadata = { title: 'Portfolio' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <RootBloombergCanvas />
        {children}
      </body>
    </html>
  );
}
