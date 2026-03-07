import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Long COVID Conference",
  description: "Long COVID Conference",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} overflow-x-hidden`}>
      <body className="relative m-0 min-h-screen overflow-x-hidden bg-[#05070b] text-white antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#0a0d14] via-zinc-950 to-[#07090d]" />
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-75 [background:radial-gradient(ellipse_at_center,rgba(255,255,255,0.085),transparent_60%)]" />
        {children}
      </body>
    </html>
  );
}
