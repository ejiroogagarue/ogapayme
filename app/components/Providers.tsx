'use client';

import { config } from "@/lib/wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";



const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }){
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {/* You can choose a theme here: darkThem, lightTheme, midnightTheme */}
                <RainbowKitProvider theme={darkTheme()}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}