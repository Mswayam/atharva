import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swayam - AI-Powered Writer",
  description: "Intelligent writing assistant for content enhancement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
