import Header                       from '@/components/Header';
import Footer                       from '@/components/Footer';
import { Inter }                    from 'next/font/google';

import { Geist, Geist_Mono }        from "next/font/google";
import clsx                         from "clsx";
import "./globals.css";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Regeneratics',
    template: '%s | Regeneratics'
  },
  description: 'Regenerative bioinformatics'
};




export default function RootLayout({ children }) {
  return (
    <html lang="en" className={clsx(inter.className, "overflow-x-hidden")}>
      <body className="overflow-x-hidden relative m-0">
          <div className="bg-gradient-to-b from-zinc-0 to-zinc-500 dark:from-zinc-950 dark:to-zinc-800 relative">

            <div
              className="absolute inset-0 z-0
                bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.05)_0_1px,transparent_1px_8px)]
                dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_8px)]"
            />

            {/* page content */}
            <Header />
            <main className="min-h-screen md:px-8 lg:px-16 pt-20 pb-12">{children}</main>
            <Footer />

          </div>
      </body>
    </html>
  );
}
