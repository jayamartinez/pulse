import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse — Wallet intelligence",
  description: "Real-time wallet activity across Solana and HOOD.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
