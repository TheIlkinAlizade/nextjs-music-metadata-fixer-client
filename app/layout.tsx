import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music Metadata & Cover Art Fixer",
  description: "Fix missing tags and cover art on your local music files.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}