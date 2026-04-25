import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'License Plate Game',
  description: 'Spot plates and claim territories on your drive.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Loads Tailwind CSS */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        
        {/* Registers the Offline Service Worker */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Offline service worker registered successfully');
                  },
                  function(err) {
                    console.log('Service worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
        
        {children}
      </body>
    </html>
  );
}
