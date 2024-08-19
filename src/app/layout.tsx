import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { constructMetaData } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const WalletMultiButtonDynamic = dynamic(
  async () => await import("../contexts/WalletContextProvider"),
  { ssr: false },
);

export const metadata = constructMetaData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <WalletMultiButtonDynamic>
            <Toaster position="bottom-center" richColors />
            {children}
          </WalletMultiButtonDynamic>
        </SessionProvider>
      </body>
    </html>
  );
}
