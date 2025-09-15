"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export function CreateLinkForm() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setLink("");

    const formData = new FormData(event.currentTarget);
    const amount = formData.get("amount");
    const description = formData.get("description");

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          description,
          walletAddress: address,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "something went wrong");
      }

      const newLink = `${window.location.origin}/pay/${result.linkId}`;
      setLink(newLink);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-center">Create a PayLink</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300"
          >
            Amount (USD)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            required
            step="0.01"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="50.00"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded -md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="e.g., Logo design"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate link"}
        </button>
      </form>
      {link && (
        <div className="mt-6 p-4 text-center bg-gray-700 rounded-md">
          <p className="text-sm text-gray-300">Your payment link is ready:</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full overflow-hidden text-lg font-mon text-greee-400 break-words whitespace-normal hover:underline"
          >
            {link}
          </a>
        </div>
      )}
    </div>
  );
}
