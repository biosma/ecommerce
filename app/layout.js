import { AppContextProvider } from '@/context/AppContext';
import { ClerkProvider } from '@clerk/nextjs';
import { Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
  title: 'E-Commerce',
  description: 'E-Commerce with Next.js ',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
