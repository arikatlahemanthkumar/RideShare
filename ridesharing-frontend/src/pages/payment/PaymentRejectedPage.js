export default function PaymentRejectedPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600">Payment Failed</h1>
                    <p className="mt-4 text-xl text-gray-700">
                        Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
                    </p>
                    <div className="mt-6">
                        <a
                            href="/"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Return to Homepage
                        </a>
                    </div>
                    
                </div>
            </div>
        </div>
    )
} 