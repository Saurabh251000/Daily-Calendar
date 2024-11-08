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
          className="w-full min-h-full bg-cover sm:bg-contain md:bg-cover" 
          style={{ backgroundImage: "url('/image/img.jpg')" }}      
        >
          <header>
            <Navbar />
          </header>
          <main className="relative px-4 sm:px-8 md:px-16 lg:px-0 xl:px-16 py-4 sm:py-6 md:py-8">
              {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
