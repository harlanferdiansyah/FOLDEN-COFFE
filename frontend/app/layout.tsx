import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Folden Coffe — Premium Coffee Experience",
  description: "Nikmati kopi premium handcrafted dari biji terbaik. Folden Coffe hadir untuk para pecinta kopi sejati.",
  keywords: ["kopi", "coffee shop", "espresso", "latte", "cappuccino", "premium coffee"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
  const snapUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>

        {/* Midtrans Snap Script — loaded globally for payment popup */}
        {clientKey && (
          <Script
            src={snapUrl}
            data-client-key={clientKey}
            strategy="afterInteractive"
            id="midtrans-snap"
          />
        )}
      </body>
    </html>
  );
}
