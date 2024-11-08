import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en">
      <body 
          className="w-full h-full bg-cover" 
          style={{ backgroundImage: "url('/image/img.jpg')" }}      
        >
          <header>
            <Navbar />
          </header>
          <main className="relative flex justify-center px-16 py-6">
              {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
