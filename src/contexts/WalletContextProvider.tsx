"use client";

import { useMemo } from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  AlphaWalletAdapter,
  AvanaWalletAdapter,
  BitpieWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  CoinhubWalletAdapter,
  FractalWalletAdapter,
  HuobiWalletAdapter,
  HyperPayWalletAdapter,
  KeystoneWalletAdapter,
  KrystalWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  NekoWalletAdapter,
  NightlyWalletAdapter,
  NufiWalletAdapter,
  OntoWalletAdapter,
  ParticleAdapter,
  SafePalWalletAdapter,
  SaifuWalletAdapter,
  SalmonWalletAdapter,
  SkyWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  SpotWalletAdapter,
  TokenaryWalletAdapter,
  TokenPocketWalletAdapter,
  TorusWalletAdapter,
  TrustWalletAdapter,
  XDEFIWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

import type { ComponentProps } from "@/types";

const WalletContextProvider = ({ children }: ComponentProps) => {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("devnet"),
    [],
  );
  const wallets = [
    new AlphaWalletAdapter(),
    new AvanaWalletAdapter(),
    new BitpieWalletAdapter(),
    new CloverWalletAdapter(),
    new Coin98WalletAdapter(),
    new CoinbaseWalletAdapter(),
    new CoinhubWalletAdapter(),
    new FractalWalletAdapter(),
    new HuobiWalletAdapter(),
    new HyperPayWalletAdapter(),
    new KeystoneWalletAdapter(),
    new KrystalWalletAdapter(),
    new LedgerWalletAdapter(),
    new MathWalletAdapter(),
    new NekoWalletAdapter(),
    new NightlyWalletAdapter(),
    new NufiWalletAdapter(),
    new OntoWalletAdapter(),
    new ParticleAdapter(),
    new SafePalWalletAdapter(),
    new SaifuWalletAdapter(),
    new SalmonWalletAdapter(),
    new SkyWalletAdapter(),
    new SolflareWalletAdapter(),
    new SolongWalletAdapter(),
    new SpotWalletAdapter(),
    new TokenaryWalletAdapter(),
    new TokenPocketWalletAdapter(),
    new TorusWalletAdapter(),
    new TrustWalletAdapter(),
    new XDEFIWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
