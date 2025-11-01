"use client";

import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { createDefaultAuthorizationResultCache, SolanaMobileWalletAdapter } from '@solana-mobile/wallet-adapter-mobile';

// Import the wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => {
    // Try to include mobile wallet adapter if available
    const walletAdapters = [];
    
    try {
      // Dynamically import mobile wallet adapter to avoid SSR issues
      const { createDefaultAuthorizationResultCache, SolanaMobileWalletAdapter } = require('@solana-mobile/wallet-adapter-mobile');
      
      walletAdapters.push(
        new SolanaMobileWalletAdapter({
         appIdentity: {
            name: 'Klouw',
            uri: 'https://klouw.vercel.app',
            icon: 'https://klouw.vercel.app/favicon.ico',
          },
          authorizationResultCache: createDefaultAuthorizationResultCache(),
        })
      );
    } catch (error) {
      console.warn('Solana Mobile Wallet Adapter not available:', error);
    }

    return walletAdapters;
  }, []);
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};