import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maalsamaan — Post What You Need',
  description: 'Verified B2B requirement and quotation network for electrical products and appliances in Nepal.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink font-body min-h-screen">
        <header className="border-b border-line/20 bg-ink text-paper">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-display font-700 text-lg tracking-tight">
              MAALSAMAAN
            </a>
            <nav className="flex gap-6 text-sm font-medium">
              <a href="/requirements" className="hover:text-amber transition-colors">My Requirements</a>
              <a href="/rfq-feed" className="hover:text-amber transition-colors">Incoming RFQs</a>
              <a href="/login" className="hover:text-amber transition-colors">Log in</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
