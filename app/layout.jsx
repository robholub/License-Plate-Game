import Script from 'next/script';
import './globals.css';

// This is the Next.js approved way to add your manifest and app title!
export const metadata = {
  title: 'License Plate Game',
  description: 'Spot plates and claim territories on your drive.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
