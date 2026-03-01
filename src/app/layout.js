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
      <body className="overflow-x-hidden m-0">{children}</body>
    </html>
  );
}
