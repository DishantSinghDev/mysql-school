import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MySQL | Sainik Public School",
  description: "Developed by Dishant Singh",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
  );
}
