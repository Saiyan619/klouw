'use client'
import { 
    createDefaultAuthorizationCache, 
    createDefaultChainSelector, 
    createDefaultWalletNotFoundHandler,
    registerMwa, 
} from '@solana-mobile/wallet-standard-mobile';

registerMwa({
    appIdentity: {
    name: 'Klouw',
    uri: 'https://klouw.vercel.app',
    icon: '/favicon.ico', // relative path resolves to https://klouw.vercel.app/favicon.ico
  },  
    authorizationCache: createDefaultAuthorizationCache(),
    chains: ['solana:devnet'],
    chainSelector: createDefaultChainSelector(),
    onWalletNotFound: createDefaultWalletNotFoundHandler(),
    remoteHostAuthority: 'klouw.vercel.app',
})