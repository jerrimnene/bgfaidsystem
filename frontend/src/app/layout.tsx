import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BGF Aid System',
  description: 'BGF Aid Application Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
          <Toaster position="top-right" />
        </LanguageProvider>
        
        {/* 11Labs Bibiana Widget - Available on ALL pages */}
        <div className="fixed bottom-6 right-6 z-50">
          <elevenlabs-convai agent-id="agent_1301k7nwqxb6et9v2f4cp1xzysq8"></elevenlabs-convai>
        </div>
        
        {/* ElevenLabs ConvAI Widget Script */}
        <script 
          src="https://unpkg.com/@elevenlabs/convai-widget-embed" 
          async 
          type="text/javascript"
        />
      </body>
    </html>
  );
}
