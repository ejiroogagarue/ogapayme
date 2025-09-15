// This function can be defined once ina lib file and imported

import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

// For now, we'll create it here for simplicity
function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// The component receives 'params' which contains the dynamic parts of the URL
export default async function PaymentPage({
  params,
}: {
  params: { linkId: string };
}) {
  const supabase = createSupabaseServerClient();

  // Fetch the specific paylink data from Supabase
  const { data: payLink, error } = await supabase
    .from("paylinks")
    .select("*")
    .eq("linkId", params.linkId)
    .single();

    // If no data is found or there's an error, show a 404 page
    if (error || !payLink) {
        notFound();
    }

    // Format the amount to a currency string (e.g., 50.00 -> $50.00)
    const amountInUSD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(payLink.amount);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-x-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Payment Request</h1>
                    <p className="text-gray-400">from {payLink.walletAddress.substring(0,6)}...{payLink.walletAddress.substring(payLink.walletAddress.length - 4)}</p>
                </div>
                <div className="p-6 space-y-4 border border-gray-700 rounded-lg">
                    <div className="flex justify-between items-baseline">
                        <span className="text-lg text-gray-300">Amount:</span>
                        <span className="text-4xl font-bold text-green-400">{amountInUSD}</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">For:</p>
                        <p className="text-lg">{payLink.description}</p>
                    </div>
                </div>
            </div>
            <div className="pt-4">
                {/* This button will be implemented in Milestone 4 */}
                <button 
                disabled className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Pay with Card (Coming Soon)
                </button>
            </div>

        </div>
    )
}
