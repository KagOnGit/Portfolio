import './globals.css';
import RootBloombergCanvas from '@/lib/bloomberg/RootBloombergCanvas';

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
