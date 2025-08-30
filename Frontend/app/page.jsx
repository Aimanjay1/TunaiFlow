import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFECD6] to-[#FFD6B3] flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold font-sans mb-6">Manage your business right<br />with us</h1>
        <p className="text-base text-gray-700 mb-8 font-sans">
          Keep track of your revenues and expenses, organize your client and generate invoices automatically. Automate your communication with clients and keep the proof of payment for further references.
        </p>
        <Link href="/dashboard" className="bg-black text-white font-semibold rounded-full px-8 py-4 flex items-center justify-center gap-2 text-lg shadow-lg hover:bg-gray-900 transition mb-10 mx-auto">
          Go to your Dashboard
          <span>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </span>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {/* Card 1 */}
        <Link href="/financial-logbook" className="bg-white rounded-2xl shadow-md p-8 w-72 flex flex-col items-center hover:shadow-xl transition">
          <span className="mb-4">
            {/* Book icon */}
            <svg width="48" height="48" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="12" width="32" height="24" rx="4" /><line x1="16" y1="20" x2="32" y2="20" /><line x1="16" y1="28" x2="32" y2="28" /></svg>
          </span>
          <h3 className="text-xl font-bold mb-2">Financial Logbook</h3>
          <p className="text-center text-gray-600">Keep track of your revenue and expenses</p>
        </Link>
        {/* Card 2 */}
        <Link href="/invoices" className="bg-white rounded-2xl shadow-md p-8 w-72 flex flex-col items-center hover:shadow-xl transition">
          <span className="mb-4">
            {/* Invoice icon */}
            <svg width="48" height="48" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="8" width="24" height="32" rx="4" /><line x1="20" y1="20" x2="28" y2="20" /><line x1="20" y1="28" x2="28" y2="28" /><line x1="20" y1="36" x2="28" y2="36" /></svg>
          </span>
          <h3 className="text-xl font-bold mb-2">Invoices</h3>
          <p className="text-center text-gray-600">Generate invoices with just a click of a button</p>
        </Link>
        {/* Card 3 */}
        <Link href="/clients" className="bg-white rounded-2xl shadow-md p-8 w-72 flex flex-col items-center hover:shadow-xl transition">
          <span className="mb-4">
            {/* User icon */}
            <svg width="48" height="48" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="18" r="6" /><path d="M12 38c0-6 12-6 12-6s12 0 12 6" /></svg>
          </span>
          <h3 className="text-xl font-bold mb-2">Client Record</h3>
          <p className="text-center text-gray-600">Organize your clients for future references</p>
        </Link>
      </div>
    </div>
  );
}
