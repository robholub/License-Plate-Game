## The License Plate Game

A mobile-first, offline-capable Progressive Web App (PWA) designed to bring the classic road trip License Plate Game into the modern era. Track plates, assign them to multiple players, and automatically save your progress as you drive—even when you lose cell service!

✨ **Features**
 - 👥 Multiplayer Support: Add up to 8 players, customize their names, and automatically assign them distinct colors for easy visual tracking.
 - 🗺️ Complete North American Database: Pre-loaded with all 50 US States, Washington D.C., Canadian Provinces, and Mexican States.
 - 🇨🇦 Flag Integration: Automatically displays high-quality national and state flags for recognized territories using FlagCDN.
 - ➕ Custom Plates: Spot a rare plate from Guam or Germany? Use the custom add feature to create and claim it on the fly.
 - 💾 Auto-Save: Progress is automatically saved to the device's localStorage. You can close the app mid-drive and pick up exactly where you left off.
 - 📵 Offline Support: Built with a custom Service Worker that caches assets. The game works perfectly even when driving through cellular dead zones.
 - 📱 Native App Feel: Designed specifically for mobile screens with sticky headers, touch-friendly grid targets, and disabled text-highlighting to prevent accidental double-tap zooming.

🛠️ **Tech Stack**
 - Framework: Next.js (App Router)
 - Library: React
 - Styling: Tailwind CSS
 - Icons: Lucide React
 - Flags: FlagCDN

🚀 **Getting Started**
Run Locally

Clone the repository:
```
git clone [https://github.com/YOUR_USERNAME/license-plate-game.git](https://github.com/YOUR_USERNAME/license-plate-game.git)
```

Navigate into the directory:
```
cd license-plate-game
```

Install the dependencies:
```
npm install
```

Start the development server:
```
npm run dev
```

Open your browser and visit http://localhost:3000.

Deploy to Vercel

This project is perfectly configured to be deployed on Vercel with zero additional configuration.

Log in to Vercel.

Click Add New... -> Project.

Import this GitHub repository.

Click Deploy.

📱 **Convert to an Android App (APK)**

Because this app includes a manifest.json and a Service Worker, it qualifies as a full Progressive Web App. You can easily package it into a native Android application:
 - Deploy the app to Vercel (or another host) so you have a live URL.
 - Go to PWABuilder.com.
 - Paste your live URL into the search bar and click Analyze.
 - Once the score populates, click Package for Android to generate your installable .apk or .aab file.

Note: The project includes an assetlinks.json setup inside the public/.well-known/ folder to automatically hide the Android browser address bar for a seamless, immersive native app experience.

📄 **License**

This project is open-source and available under the MIT License.
