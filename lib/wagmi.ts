import { mainnet, sepolia } from 'wagmi/chains'
import {getDefaultConfig } from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
    appName: 'OGAPayMe',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [mainnet, sepolia],
    ssr: true,
})