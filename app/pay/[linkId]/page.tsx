"use client";

import { createClient } from "@supabase/supabase-js";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define the type for our PayLink data
type PayLink = {
  linkId: string;
  walletAddress: string;
  amount: number;
  description: string;
  status: string;
};

// We use the anon key here because this is now a client-side component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// The component receives 'params' which contains the dynamic parts of the URL
export default function PaymentPage({
  params,
}: {
  params: { linkId: string };
}) {
  const [payLink, setPayLink] = useState<PayLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPayLink() {
      const { data, error } = await supabase
        .from("paylinks")
        .select("*")
        .eq("linkId", params.linkId)
        .single();

      if (error || !data) {
        setError("Link not found.");
      } else {
        setPayLink(data);
      }
      setLoading(false);
    }

    fetchPayLink();
  }, [params.linkId]);

  const handlePayment = async () => {
    if (!payLink) return;
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payLink.amount,
          linkId: payLink.linkId,
          description: payLink.description,
        }),
      });
      const { url } = await response.json();
      if (url) {
        // Redirect the user to Stripe's checkout page
        router.push(url);
      }
    } catch (e) {
      setError("Failed to start payment.");
      setLoading(false);
    }
  };

  if (loading && !payLink)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  if (!payLink) return notFound();

  // Format the amount to a currency string (e.g., 50.00 -> $50.00)
  const amountInUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(payLink.amount);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-x-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        {payLink.status === "paid" ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-400">Paid</h1>
            <p className="text-gray-300 mt-2">
              This payment has been completed.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Payment Request</h1>
            </div>
            <div className="p-6 space-y-4 border border-gray-700 rounded-lg">
              <div className="flex justify-between items-baseline">
                <span className="text-lg text-gray-300">Amount:</span>
                <span className="text-4xl font-bold text-green-400">
                  {amountInUSD}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-400">For:</p>
                <p className="text-lg">{payLink.description}</p>
              </div>
            </div>

            <div className="pt-4">
              {/* This button will be implemented in Milestone 4 */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Pay with Card"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
