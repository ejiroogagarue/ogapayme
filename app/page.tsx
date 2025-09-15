'use client'; // Client component

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CreateLinkForm } from "./components/CreateLink";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 border-b border-gray-700">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">OGAPayMe</h1>
          <ConnectButton />
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        {isConnected ? (
          <CreateLinkForm />
        ) : (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              The Simplest Way to Get Paid in Crypto
            </h2>
            <p className="text-lg text-gray-400">
              Create a payment link. Share it. Get USDC in your wallet
              instantly.
            </p>
            {/* The "Create PayLink" button will go here in Milestone 2 */}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-700 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} OGAPayMe. All rights reserved.</p>
      </footer>
    </div>
  );
}
