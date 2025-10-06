import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import type { Metadata } from "next";
import { SolanaProvider } from "@/app/provider/Solana";
// import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "Klouw",
  description: "A Defi Token Splitter on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body>
        <SolanaProvider>
          {children}
              </SolanaProvider>
      </body>
    </html>
  );
}
