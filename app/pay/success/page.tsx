export default function PaymentSuccessPage(){
    return(
        <div className="flex flex-col items-center justofy-center min-h-screen bg-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-400">Payment Successful!</h1>
                <p className="mt-4 text-lg text-gray-300">
                    The USDC has been sent to the freelancer&apos;s wallet.
                </p>
            </div>
        </div>
    )
}